export class SoddleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class WalletNotConnectedError extends SoddleError {
  constructor() {
    super("Wallet is not connected");
  }
}

export class ProgramNotInitializedError extends SoddleError {
  constructor() {
    super("Program is not initialized");
  }
}

export class NoActiveCompetitionError extends SoddleError {
  constructor() {
    super("No active competition found");
  }
}

export class GameSessionCreationError extends SoddleError {
  constructor(message: string = "Failed to create game session") {
    super(message);
  }
}

export class DailyGameLimitReachedError extends SoddleError {
  constructor() {
    super("You can only play once per day");
  }
}

export class GameSessionNotFoundError extends SoddleError {
  constructor() {
    super("Game session not found");
  }
}

export class GameAlreadyCompletedError extends SoddleError {
  constructor() {
    super("Game session is already completed");
  }
}

export class ApiRequestError extends SoddleError {
  constructor(message: string) {
    super(`API request failed: ${message}`);
  }
}

export class InternalServerError extends SoddleError {
  constructor() {
    super("An internal server error occurred");
  }
}

export class WalletSignTransactionError extends SoddleError {
  constructor() {
    super("Failed to sign transaction");
  }
}

export class GuessAlreadyMadeError extends SoddleError {
  constructor() {
    super("Guess already made");
  }
}
