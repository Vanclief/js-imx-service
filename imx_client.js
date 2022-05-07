/** @format */

import { ImmutableXClient } from "@imtbl/imx-sdk";
import { BigNumber, ethers } from "ethers";
import { Wallet } from "@ethersproject/wallet";
import { AlchemyProvider } from "@ethersproject/providers";

const networkParams = {
  ropsten: {
    apiUrl: "https://api.ropsten.x.immutable.com/v1",
    starkContractAddr: "0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef",
    registratrionContractAddr: "0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864",
  },
  mainnet: {
    apiUrl: "https://api.x.immutable.com/v1",
    starkContractAddr: "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9",
    registratrionContractAddr: "0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c",
  },
};

export class IMXClient {
  async init(request) {
    // Get the network configuration
    let selectedNetwork;

    if (request.network === "ropsten") selectedNetwork = networkParams.ropsten;
    else if (request.network === "mainet")
      selectedNetwork = networkParams.mainnet;
    else throw Error(`[TYPESCRIPTWRAPPER]: Unknown network type: '${network}'`);

    // Create the signer
    const provider = new AlchemyProvider(request.network, request.alchemy_key);
    const signer = new Wallet(request.private_key).connect(provider);

    this.publicKey = signer.address;

    // Create the client
    this.client = await ImmutableXClient.build({
      publicApiUrl: selectedNetwork.apiUrl,
      signer: signer,
      starkContractAddress: selectedNetwork.starkContractAddr,
      registrationContractAddress: selectedNetwork.registratrionContractAddr,
      // gasLimit: gasLimit,
      // gasPrice: gasPrice,
    });

    return this.client;
  }

  isInstatiated() {
    if (this.client === undefined) {
      throw Error("IMX client not instantiated");
    }
  }

  async register() {
    this.isInstatiated();

    return await this.client.registerImx({
      etherKey: this.client.address.toLowerCase(),
      starkPublicKey: this.client.starkPublicKey,
    });
  }

  async transferERC20(request) {
    let ethAmount = ethers.utils.formatUnits(request.amount, "ether");
    const params = {
      sender: this.publicKey.toLowerCase(), // TODO return an error if publicKey doesn't exist
      token: {
        type: "ERC20",
        data: {
          symbol: request.symbol,
          decimals: 18,
          tokenAddress: request.token_address.toLowerCase(),
        },
      },
      quantity: ethers.utils.parseEther(ethAmount),
      receiver: request.to_address.toLowerCase(),
    };

    return await this.client.transfer(params);
  }

  async transferERC721(request) {
    const params = {
      sender_ether_key: this.publicKey.toLowerCase(), // TODO return an error if publicKey doesn't exist
      transfer_request: [
        {
          token: {
            type: "ERC721",
            data: {
              tokenId: request.token_id,
              tokenAddress: request.token_address?.toLowerCase(),
            },
          },
          amount: BigNumber.from(1),
          receiver: request.to_address,
        },
      ],
    };

    return await this.client.transferV2(params);
  }

  async approveERC20(request) {
    request.sender = this.publicKey;

    return await this.client.approveERC20(request);
  }

  async approveERC721(request) {
    request.sender = this.publicKey;

    return await this.client.approveNFT(request);
  }
}
