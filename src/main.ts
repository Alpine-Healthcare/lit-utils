import ethers from "ethers";
import { LIT_RPC, LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

const ETHEREUM_PRIVATE_KEY= "2a121edbe5c8f55f0c5a1edb63449f0efdeb3731b8ab28c91f81dcc143c8ea32";

export const delegateCapacityCredit = async (
  capacityTokenId: string,
  delegateeAddress: string
): Promise<object> => {
  let litNodeClient: LitNodeClient;

  try {
    const ethersSigner = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to Lit network...");
    litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to Lit network");

    console.log("🔄 Generating delegation Auth Signature...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersSigner,
        capacityTokenId,
        delegateeAddresses: [delegateeAddress],
        uses: "1000",
        expiration: new Date(Date.now() + 1000 * 60 * 10000).toISOString(), // 10 minutes
      });
    console.log("✅ Generated delegation Auth Signature");
    console.log("capacityDelegationAuthSig: ", capacityDelegationAuthSig)

    return capacityDelegationAuthSig;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    litNodeClient!.disconnect();
  }
};

export const main = async (): Promise<void> => {

  const addressToDelegate = "0xcbc11e534077a181476c7a5c511a5ffb4c17db65"
  const capacityCreditId = "110585"

  await delegateCapacityCredit(capacityCreditId, addressToDelegate)
}

main()
