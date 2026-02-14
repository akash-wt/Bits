import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import type {
    SolanaSignInInput,
    SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";
import { Buffer } from 'buffer';
import { APP_IDENTITY, SIGN_IN_PAYLOAD } from "./config";
import { stringToUint8Array } from "../utils";

window.Buffer = Buffer;

export async function connectWalletAndVerifyNonce() {
    return transact(async (wallet: Web3MobileWallet) => {
        try {
            const authorizationResult = await wallet.authorize({
                chain: 'solana:devnet',
                identity: APP_IDENTITY,
                sign_in_payload: SIGN_IN_PAYLOAD
            });

            if (!authorizationResult.sign_in_result) {
                throw new Error("no sign_in_result returned from wallet")
            }
            
            const SIGN_IN_OUTPUT: SolanaSignInOutput = {
                account: {
                    address: authorizationResult.accounts[0].address,
                    publicKey: Object.freeze(stringToUint8Array(authorizationResult.accounts[0].address)),
                    chains: ["solana:devnet"],
                    features: ["solana:signIn"]
                },
                signedMessage: stringToUint8Array(authorizationResult.sign_in_result?.signed_message),
                signature: stringToUint8Array(authorizationResult.sign_in_result?.signature),
            }

            const verifySIWSResult = verifySIWS(SIGN_IN_PAYLOAD, SIGN_IN_OUTPUT)
            return {
                verfied: verifySIWSResult
            };
        } catch (e: any) {
            console.log(e);
        }
    })
}


function verifySIWS(
    input: SolanaSignInInput,
    output: SolanaSignInOutput
): boolean {
    const serialisedOutput: SolanaSignInOutput = {
        account: {
            ...output.account,
            publicKey: new Uint8Array(output.account.publicKey),
        },
        signature: new Uint8Array(output.signature),
        signedMessage: new Uint8Array(output.signedMessage),
    }
    return verifySignIn(input, serialisedOutput);
}

