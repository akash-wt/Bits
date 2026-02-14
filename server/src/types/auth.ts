import { z } from "zod";

export const VerifySchema = z.object({
    publicKey: z.string(),
    signature: z.string(),
    signedMessage: z.string()
})

