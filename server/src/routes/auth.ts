import { Router } from "express";
import { VerifySchema } from "../types/auth.js";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

const router = Router()

router.post("/verify/nonce", async (req, res) => {
    try {

        const parseBody = VerifySchema.safeParse(req.body);
        if (!parseBody.success) {
            return res.status(400).json({ msg: "Incorrect inputs" });
        }
        console.log(parseBody.data);


        const { publicKey, signedMessage, signature } = parseBody.data;

        const publicKeyBytes = Buffer.from(publicKey, "base64");
        const messageBytes = new TextEncoder().encode(signedMessage);
        const signatureBytes = Buffer.from(signature, "base64");

        console.log("publicKeyBytes:", publicKeyBytes.length);   // should be 32
        console.log("signatureBytes:", signatureBytes.length);

        const verified = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
        );

        console.log("verified:  ", verified);
        if (!verified) {
            return res.status(401).json({ msg: "Invalid signature" });
        }

        return res.json({ verified: true });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Server error" });
    }

})

export default router;
export const authRouter = router;