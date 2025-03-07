import ethers from "ethers";
import { LIT_RPC, LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

const ETHEREUM_PRIVATE_KEY= "";

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
        delegateeAddresses: [],
        uses: "1000",
        expiration: new Date(Date.now() + 1000 * 60 * 10000).toISOString(), // 10 minutes
      });
    console.log("✅ Generated delegation Auth Signature");

    return capacityDelegationAuthSig;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    litNodeClient!.disconnect();
  }
};

export const main = async (): Promise<void> => {

  const addressToDelegate = "0x6309Bd836Fd8FD103742bf3b87A09a1a016eA959"
  const capacityCreditId = "128716"

  const capacityDelegationAuthSig =  await delegateCapacityCredit(capacityCreditId, addressToDelegate)
  console.log("capacityDelegationAuthSig: ", capacityDelegationAuthSig)
}

main()
