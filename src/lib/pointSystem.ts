export interface PlayerStats {
  score: number;
  time: number;
  mistakes: number;
  difficulty: number;
}

export interface DailyChallenge {
  description: string;
  condition: (stats: PlayerStats) => boolean;
}

export interface PointCalculationStrategy {
  calculate: (stats: PlayerStats) => number;
}

export type LeaderboardTier = "gold" | "silver" | "bronze" | "none";

export interface TierMultiplier {
  tier: LeaderboardTier;
  multiplier: number;
}

export class BasePointStrategy implements PointCalculationStrategy {
  calculate = (stats: PlayerStats): number => {
    return stats.score;
  };
}

export class SpeedBonusStrategy implements PointCalculationStrategy {
  calculate = (stats: PlayerStats): number => {
    return Math.max(0, 100 - stats.time);
  };
}

export class AccuracyBonusStrategy implements PointCalculationStrategy {
  calculate = (stats: PlayerStats): number => {
    return Math.max(0, 50 - stats.mistakes * 10);
  };
}

export class DifficultyMultiplierStrategy implements PointCalculationStrategy {
  calculate = (stats: PlayerStats): number => {
    return 1 + stats.difficulty * 0.5;
  };
}

export class BonusPointsStrategy implements PointCalculationStrategy {
  calculate = (stats: PlayerStats): number => {
    let bonus = 0;
    if (stats.mistakes === 0) bonus += 50;
    if (stats.time < 60) bonus += 30;
    return bonus;
  };
}

export class DailyChallengeStrategy implements PointCalculationStrategy {
  private challenge: DailyChallenge;

  constructor(challenge: DailyChallenge) {
    this.challenge = challenge;
  }

  calculate = (stats: PlayerStats): number => {
    return this.challenge.condition(stats) ? 100 : 0;
  };
}

export class PointCalculator {
  private strategies: PointCalculationStrategy[];
  private tierMultipliers: TierMultiplier[];

  constructor(dailyChallenge?: DailyChallengeStrategy) {
    this.strategies = [
      new BasePointStrategy(),
      new SpeedBonusStrategy(),
      new AccuracyBonusStrategy(),
      new BonusPointsStrategy(),
    ];

    if (dailyChallenge) {
      this.strategies.push(dailyChallenge);
    }

    this.tierMultipliers = [
      { tier: "gold", multiplier: 2 },
      { tier: "silver", multiplier: 1.5 },
      { tier: "bronze", multiplier: 1.2 },
      { tier: "none", multiplier: 1 },
    ];
  }

  calculatePoints(
    stats: PlayerStats,
    rank: number,
    totalPlayers: number
  ): number {
    const basePoints = this.strategies.reduce(
      (total, strategy) => total + strategy.calculate(stats),
      0
    );
    const difficultyMultiplier = new DifficultyMultiplierStrategy().calculate(
      stats
    );
    const tierMultiplier = this.getTierMultiplier(rank, totalPlayers);

    return Math.round(basePoints * difficultyMultiplier * tierMultiplier);
  }

  private getTierMultiplier = (rank: number, totalPlayers: number): number => {
    const percentile = (rank / totalPlayers) * 100;
    if (percentile <= 10)
      return this.tierMultipliers.find((t) => t.tier === "gold")!.multiplier;
    if (percentile <= 25)
      return this.tierMultipliers.find((t) => t.tier === "silver")!.multiplier;
    if (percentile <= 50)
      return this.tierMultipliers.find((t) => t.tier === "bronze")!.multiplier;
    return this.tierMultipliers.find((t) => t.tier === "none")!.multiplier;
  };
}
