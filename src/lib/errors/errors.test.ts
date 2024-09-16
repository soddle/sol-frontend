// import { ErrorCode } from "@/lib/errors/errorTypes";
// import { createError, GameError, WalletConnectionError } from "../errors";
// import test, { describe } from "node:test";

// describe("Error handling", () => {
//   test("createError creates the correct error type", () => {
//     const error = createError(ErrorCode.WALLET_CONNECTION_FAILED);
//     expect(error).toBeInstanceOf(WalletConnectionError);
//     expect(error.message).toBe("Failed to connect wallet");
//   });

//   test("createError with custom message", () => {
//     const customMessage = "Custom error message";
//     const error = createError(ErrorCode.INVALID_GUESS, customMessage);
//     expect(error).toBeInstanceOf(GameError);
//     expect(error.message).toBe(customMessage);
//   });

//   test("Error code is set correctly", () => {
//     const error = createError(ErrorCode.MAX_GUESSES_REACHED);
//     expect(error.code).toBe(ErrorCode.MAX_GUESSES_REACHED);
//   });

//   test("Default message is used when no custom message is provided", () => {
//     const error = createError(ErrorCode.NETWORK_ERROR);
//     expect(error.message).toBe("Network error occurred");
//   });
// });
