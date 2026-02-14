import { Router } from "express";
import { VerifySchema } from "../types/auth.js";
import nacl from "tweetnacl";
import { Buffer } from "buffer";
import crypto from "crypto";


const router = Router()

router.post("/verify", async (req, res) => {
    try {
        const parseBody = VerifySchema.safeParse(req.body);
        if (!parseBody.success) {
            return res.status(400).json({ msg: "Incorrect inputs" });
        }

        const { publicKey, signedMessage, signature } = parseBody.data;

        const publicKeyBytes = Buffer.from(publicKey, "base64");
        const messageBytes = Buffer.from(signedMessage, "base64");
        const signatureBytes = Buffer.from(signature, "base64");

        const verified = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
        );

        if (!verified) {
            return res.status(401).json({ msg: "Invalid signature" });
        }

        return res.json({ verified: true });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Server error" });
    }

})




router.get("/nonce", async (req, res) => {
  const nonce = crypto.randomUUID();

  // store nonce temporarily (DB or memory)
  // example: saveNonce(pubkey, nonce)

  res.json({ nonce });
});

export default router;


export const authRouter = router;