import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import axios from "axios"

const APP_IDENTITY = {
    name: "Bits",
    uri: "https://bits.app",
    icon: "favicon.ico",
};


async function connectWallet() {
    return await transact(async (wallet: Web3MobileWallet) => {
        try {
            const authorizationResult = await wallet.authorize({
                chain: 'solana:devnet',
                identity: APP_IDENTITY,
            });
            if (!authorizationResult.accounts[0].address) {
                throw new Error("no address returned from wallet")
            }
            return {
                address: authorizationResult.accounts[0].address
            };
        } catch (e: any) {
            console.log(e);
        }
    })
}

async function signNonceMessage(nonce: string, address: string) {
    return await transact(async (wallet: Web3MobileWallet) => {
        try {
            const message = 'Please sign this message to verify your identity. Nonce: ' + nonce;
            const messageBuffer = new Uint8Array(
                message.split('').map(c => c.charCodeAt(0)),
            );

            const signedMessages = wallet.signMessages({
                addresses: [address],
                payloads: [messageBuffer]
            })

            console.log("signedMessages ", signedMessages);

            return signedMessages;

        } catch (e: any) {
            console.log(e);
        }
    })
}
export async function checkUserExist() {
    try {
        const res = await connectWallet();
        if (!res?.address) {
            throw new Error("wallet doesn't retuned address");
        }
        const res2 = await axios.post("http://10.67.120.95:3000/api/v1/user/check", {
            "publicKey": res.address
        })
        // console.log(res2`.data);

        console.log("before calling nonce");

        const nonceRes = await signNonceMessage(res2.data.nonce, res.address);

        console.log("before calling nonce");
        console.log(nonceRes);

    } catch (e) {
        console.log(e);
    }
}