# Soddle Pointing System Documentation

## Overview

The Soddle pointing system is designed to reward players based on their performance in various mini-games. The system takes into account multiple factors such as speed, accuracy, difficulty level, and special achievements. This document outlines the components of the pointing system and how they are calculated.

## Components of the Pointing System

### 1. Base Points

- **Description**: Base points are awarded for completing a game. The base score is determined by the player's performance in the game.
- **Calculation**: The base score is directly derived from the player's actions and outcomes in the game.

### 2. Dynamic Point Allocation

- **Speed Bonus**: Points awarded for completing the game quickly.

  - **Formula**: `speedBonus = Math.max(0, 100 - timeTaken)`
  - **Explanation**: Faster completion results in higher bonus points.

- **Accuracy Bonus**: Points awarded for making fewer mistakes.

  - **Formula**: `accuracyBonus = Math.max(0, 50 - mistakes * 10)`
  - **Explanation**: Fewer mistakes result in higher bonus points.

- **Difficulty Multiplier**: Multiplier applied based on the difficulty level of the game.
  - **Formula**: `difficultyMultiplier = 1 + difficultyLevel * 0.5`
  - **Explanation**: Higher difficulty levels yield higher multipliers.

### 3. Bonus Points

- **No Mistakes Bonus**: Awarded for completing a game without any mistakes.

  - **Points**: 50

- **Time Bonus**: Awarded for completing a game within a specific time frame.
  - **Points**: 30 for completion under a minute.

### 4. Daily Challenges

- **Description**: Special challenges that offer additional points for completion.
- **Reward**: 100 points for completing the daily challenge.

### 5. Leaderboard Tiers

- **Gold Tier**: Top 10% of players.

  - **Multiplier**: 2x

- **Silver Tier**: Top 25% of players.

  - **Multiplier**: 1.5x

- **Bronze Tier**: Top 50% of players.

  - **Multiplier**: 1.2x

- **No Tier**: Below 50%.
  - **Multiplier**: 1x

## Total Points Calculation

The total points for a player are calculated using the following formula:
totalPoints = (basePoints + speedBonus + accuracyBonus + bonusPoints + dailyChallengePoints) tierMultiplier

## Implementation

The pointing system is implemented in the backend using functions that calculate each component based on the player's performance data. These functions are integrated into the game logic to ensure accurate and fair point distribution.

## References

- **Leaderboard Table Component**: Handles the display of player ranks and points.

  ```typescript:src/app/(activityPages)/leaderboard/_components/leaderboardTable.tsx
  startLine: 1
  endLine: 82
  ```

- **Leaderboard Actions**: Fetches and calculates leaderboard data.

  ```typescript:src/actions/leaderboardActions.ts
  startLine: 1
  endLine: 158
  ```

- **Leaderboard Container**: Manages state and data fetching for the leaderboard.
  ```typescript:src/app/(activityPages)/leaderboard/_components/leaderboardContainer.tsx
  startLine: 1
  endLine: 86
  ```

This pointing system aims to create a balanced and engaging experience for players, encouraging them to improve their skills and compete for higher ranks.
