import { CONSTANTS, PushAPI } from "@pushprotocol/react-native-sdk";
import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";

const usePush = () => {
  const PUSH_PRIVATE_KEY = "pushPrivateKey";

  let wallet: ethers.Wallet;
  let address: string;
  let pushAPI: PushAPI;

  const createWallet = async (): Promise<ethers.Wallet> => {
    console.log("createWallet");
    // Creating a random signer from a wallet
    const wallet = ethers.Wallet.createRandom();
    console.log("Wallet created with address: ", wallet.address);

    // store the private key and the address
    await SecureStore.setItemAsync(PUSH_PRIVATE_KEY, wallet.privateKey);
    console.log("Private key stored");

    return wallet;
  };

  const initWallet = async () => {
    console.log("initWallet");
    const privateKey = await SecureStore.getItemAsync(PUSH_PRIVATE_KEY);

    if (!privateKey) {
      wallet = await createWallet();
    } else {
      wallet = new ethers.Wallet(privateKey);
    }
    address = `eip155:${wallet.address}`;
    console.log("Wallet initialized with address: ", address);
  };

  const getPush = async (): Promise<PushAPI> => {
    console.log("getPush: called");
    if (!wallet) {
      console.log("getPush: initWallet");
      await initWallet();
    }
    if (!pushAPI) {
      console.log("Initializing pushAPI: ", +wallet.getAddress());
      pushAPI = await PushAPI.initialize(wallet, {
        account: address,
        env: CONSTANTS.ENV.DEV,
      });
    }
    return pushAPI;
  };

  return { getPush };
};

export default usePush;
