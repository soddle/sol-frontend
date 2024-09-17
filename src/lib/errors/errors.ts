import { ErrorCode, ErrorMessages } from "./errorTypes";

export class GameError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message || ErrorMessages[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class WalletConnectionError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.WALLET_CONNECTION_FAILED, message);
  }
}

export class GameSessionNotFoundError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.GAME_SESSION_NOT_FOUND, message);
  }
}

export class InvalidGuessError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.INVALID_GUESS, message);
  }
}

export class ApiRequestError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.API_REQUEST_FAILED, message);
  }
}

export class NetworkError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.NETWORK_ERROR, message);
  }
}

export class GameAlreadyCompletedError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.GAME_ALREADY_COMPLETED, message);
  }
}

export class InvalidGameTypeError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.INVALID_GAME_TYPE, message);
  }
}

export class MaxGuessesReachedError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.MAX_GUESSES_REACHED, message);
  }
}

export class UnauthorizedError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.UNAUTHORIZED, message);
  }
}

export class InternalServerError extends GameError {
  constructor(message?: string) {
    super(ErrorCode.INTERNAL_SERVER_ERROR, message);
  }
}
export class AccountNotFound extends GameError {
  constructor(message?: string) {
    super(ErrorCode.ECLIPSE_ACCOUNT_NOT_FOUND, message);
  }
}

export function createError(code: ErrorCode, message?: string): GameError {
  switch (code) {
    case ErrorCode.WALLET_CONNECTION_FAILED:
      return new WalletConnectionError(message);
    case ErrorCode.ECLIPSE_ACCOUNT_NOT_FOUND:
      return new AccountNotFound(message);
    case ErrorCode.GAME_SESSION_NOT_FOUND:
      return new GameSessionNotFoundError(message);
    case ErrorCode.INVALID_GUESS:
      return new InvalidGuessError(message);
    case ErrorCode.API_REQUEST_FAILED:
      return new ApiRequestError(message);
    case ErrorCode.NETWORK_ERROR:
      return new NetworkError(message);
    case ErrorCode.GAME_ALREADY_COMPLETED:
      return new GameAlreadyCompletedError(message);
    case ErrorCode.INVALID_GAME_TYPE:
      return new InvalidGameTypeError(message);
    case ErrorCode.MAX_GUESSES_REACHED:
      return new MaxGuessesReachedError(message);
    case ErrorCode.UNAUTHORIZED:
      return new UnauthorizedError(message);
    case ErrorCode.INTERNAL_SERVER_ERROR:
      return new InternalServerError(message);
    default:
      return new GameError(code, message);
  }
}
