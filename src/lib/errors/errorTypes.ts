export enum ErrorCode {
  WALLET_CONNECTION_FAILED = "WALLET_CONNECTION_FAILED",
  GAME_SESSION_NOT_FOUND = "GAME_SESSION_NOT_FOUND",
  ECLIPSE_ACCOUNT_NOT_FOUND = "SOLANA_ACCOUNT_NOT_FOUND",
  INVALID_GUESS = "INVALID_GUESS",
  API_REQUEST_FAILED = "API_REQUEST_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
  GAME_ALREADY_COMPLETED = "GAME_ALREADY_COMPLETED",
  INVALID_GAME_TYPE = "INVALID_GAME_TYPE",
  MAX_GUESSES_REACHED = "MAX_GUESSES_REACHED",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.ECLIPSE_ACCOUNT_NOT_FOUND]: "Failed to fetch Eclipse Account",
  [ErrorCode.WALLET_CONNECTION_FAILED]: "Failed to connect wallet",
  [ErrorCode.GAME_SESSION_NOT_FOUND]: "Game session not found",
  [ErrorCode.INVALID_GUESS]: "Invalid guess",
  [ErrorCode.API_REQUEST_FAILED]: "API request failed",
  [ErrorCode.NETWORK_ERROR]: "Network error occurred",
  [ErrorCode.GAME_ALREADY_COMPLETED]: "Game session is already completed",
  [ErrorCode.INVALID_GAME_TYPE]: "Invalid game type",
  [ErrorCode.MAX_GUESSES_REACHED]: "Maximum number of guesses reached",
  [ErrorCode.UNAUTHORIZED]: "Unauthorized access",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
};
