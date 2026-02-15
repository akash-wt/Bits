import { z } from "zod";

export const UserSchema = z.object({
    publicKey: z.string(),
    name: z.string().optional(),
    nonce: z.string().optional()

})

