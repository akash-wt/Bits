import { Router } from "express";
import crypto from "crypto";
import { UserSchema } from "../types/user.js";
import { prisma } from "../lib/prisma.js";
const router = Router()

router.post("/check", async (req, res) => {
    try {
        const nonce = crypto.randomUUID();
        const parseBody = UserSchema.safeParse(req.body);
        if (!parseBody.success) {
            return res.status(400).json({ msg: "Incorrect inputs" });
        }

        const { publicKey, name } = parseBody.data;

        const userExist = prisma.user.findUnique({
            where: {
                pubKey: publicKey
            }
        })

        console.log(userExist);

        if (!userExist) {
            const user = prisma.user.create({
                data: {
                    pubKey: publicKey,
                    nonce
                }
            })
        }
        // const updateUser= prisma.user.update({
        //     where:{
        //         id:userExist
        //     }
        // })

        res.json({ nonce });
    } catch (e: any) {
        console.log(e);
        throw new Error("user/nonce failed", e)
    }
})

export const userRouter = router;