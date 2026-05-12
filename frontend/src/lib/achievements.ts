export type RewardType = "Badge" | "Avatar";

export interface UserStats {
  total_stars: number;
  missions_completed: number;
  perfect_missions: number;
}

export interface AchievementRule {
  id: string;
  name: string;
  type: RewardType;
  description: string;
  motivationalMessage: string;
  targets: {
    total_stars: number;
    missions_completed: number;
    perfect_missions: number;
  };
}

export interface UnlockedReward {
  id: string;
  name: string;
  type: RewardType;
  message: string;
}

export const ACHIEVEMENTS: AchievementRule[] = [
  {
    id: "badge_rajin",
    name: "Penjelajah Pemula",
    type: "Badge",
    description: "Selesaikan 10 misi pertamamu.",
    motivationalMessage: "Wah, kamu hebat! Terus semangat belajar dan menjelajah ya!",
    targets: { total_stars: 0, missions_completed: 10, perfect_missions: 0 }
  },
  {
    id: "avatar_kolektor",
    name: "Kolektor Bintang",
    type: "Avatar",
    description: "Kumpulkan 30 bintang dari misimu.",
    motivationalMessage: "Wow! Bintang-bintang ini bersinar secerah dirimu!",
    targets: { total_stars: 30, missions_completed: 0, perfect_missions: 0 }
  },
  {
    id: "badge_teliti",
    name: "Si Mata Elang",
    type: "Badge",
    description: "Selesaikan 5 misi dengan sempurna (Bintang 3).",
    motivationalMessage: "Ketelitianmu patut diacungi jempol, tidak ada yang terlewat!",
    targets: { total_stars: 0, missions_completed: 0, perfect_missions: 5 }
  },
  {
    id: "avatar_petualang",
    name: "Petualang Hebat",
    type: "Avatar",
    description: "Selesaikan 20 misi secara keseluruhan.",
    motivationalMessage: "Luar biasa! Kamu adalah petualang sejati yang tangguh!",
    targets: { total_stars: 0, missions_completed: 20, perfect_missions: 0 }
  },
  {
    id: "badge_cemerlang",
    name: "Bintang Cemerlang",
    type: "Badge",
    description: "Kumpulkan 60 bintang.",
    motivationalMessage: "Keren banget! Kamu bersinar terang seperti bintang di langit malam!",
    targets: { total_stars: 60, missions_completed: 0, perfect_missions: 0 }
  },
  {
    id: "avatar_super_jenius",
    name: "Sang Juara",
    type: "Avatar",
    description: "Selesaikan 15 misi dengan sempurna (Bintang 3).",
    motivationalMessage: "Sempurna! Tidak ada tantangan yang terlalu sulit buat kamu!",
    targets: { total_stars: 0, missions_completed: 0, perfect_missions: 15 }
  },
  {
    id: "avatar_legenda",
    name: "Sang Legenda",
    type: "Avatar",
    description: "Kumpulkan 80 bintang, selesaikan 30 misi, dan raih 15 misi sempurna.",
    motivationalMessage: "Luar biasa! Kamu adalah legenda sesungguhnya di dunia GrinBuds!",
    targets: { total_stars: 80, missions_completed: 30, perfect_missions: 15 }
  }
];

export function isAchievementUnlocked(achievement: AchievementRule, stats: UserStats): boolean {
  return stats.total_stars >= achievement.targets.total_stars &&
         stats.missions_completed >= achievement.targets.missions_completed &&
         stats.perfect_missions >= achievement.targets.perfect_missions;
}

export function evaluateAchievements(stats: UserStats): UnlockedReward[] {
  const unlockedRewards: UnlockedReward[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (isAchievementUnlocked(achievement, stats)) {
      unlockedRewards.push({
        id: achievement.id,
        name: achievement.name,
        type: achievement.type,
        message: achievement.motivationalMessage,
      });
    }
  }

  return unlockedRewards;
}
