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

export async function signNonceMessage(nonce: string, address: string) {
    return await transact(async (wallet: Web3MobileWallet) => {
        try {

            const authorizationResult = await wallet.authorize({
                chain: 'solana:devnet',
                identity: APP_IDENTITY,
            });

            const message = 'Please sign this message to verify your identity. Nonce: ' + nonce;
            const messageBuffer = new Uint8Array(
                message.split('').map(c => c.charCodeAt(0)),
            );

            const signedMessages = await wallet.signMessages({
                addresses: [address],
                payloads: [messageBuffer]
            })

            return signedMessages;

        } catch (e: any) {
            console.log("Error ", e);
        }
    })

}


export async function checkUserExist() {
    try {
        const response = await connectWallet();

        if (!response?.address) {
            throw new Error("wallet doesn't retuned address");
        }

        const res2 = await axios.post("http://10.0.2.2:3000/api/v1/user/check", {
            "publicKey": response.address
        })
        const nonceRes = await signNonceMessage("123", response.address);

        console.log("nonce response ",nonceRes);
        
    } catch (e) {
        console.log("error ", e);
    }
}