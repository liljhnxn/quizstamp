import contractData from "./contractInfo.json";
import { type Address } from "viem";

export const QUIZ_STAMP_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "personalBest",
        type: "uint256",
      },
    ],
    name: "ScoreSubmitted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "bestScores",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyBestScore",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMySubmissions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalSubmissions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "saveScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "submissionCounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSubmissions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const QUIZ_STAMP_MAINNET_ADDRESS: Address = "0xA240ab0065Bdc9E5A1271318166Dc5d17e5c2100";

/**
 * Returns the QuizStamp contract address on Botchain Mainnet.
 * Strictly guarantees the new Mainnet address is used, rejecting any stale testnet address.
 */
export function getQuizStampAddress(): Address {
  const envAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();
  const jsonAddress = (contractData.address as string)?.trim();
  const addr = envAddress || jsonAddress;

  if (
    addr &&
    addr.startsWith("0x") &&
    addr.toLowerCase() !== "0x37399dae8d08a6e836ca56273724efe93811d709" &&
    addr.length === 42
  ) {
    return addr as Address;
  }
  return QUIZ_STAMP_MAINNET_ADDRESS;
}
