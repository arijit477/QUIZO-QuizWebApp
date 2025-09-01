import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProgressService, QuizProgress } from './progress.service';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // CSS class or icon name
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  category?: string; // for category-specific achievements
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private storageKey = 'userAchievements';

  private achievementsSubject: BehaviorSubject<Achievement[]>;
  achievements$: Observable<Achievement[]>;

  private achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedDate' | 'progress'>[] = [
    // Quiz Completion Badges
    { id: 'first-quiz', title: 'First Steps', description: 'Complete your first quiz', icon: 'trophy', maxProgress: 1 },
    { id: 'quiz-10', title: 'Quiz Enthusiast', description: 'Complete 10 quizzes', icon: 'star', maxProgress: 10 },
    { id: 'quiz-25', title: 'Quiz Master', description: 'Complete 25 quizzes', icon: 'award', maxProgress: 25 },
    { id: 'quiz-50', title: 'Quiz Champion', description: 'Complete 50 quizzes', icon: 'medal', maxProgress: 50 },
    { id: 'quiz-100', title: 'Quiz Legend', description: 'Complete 100 quizzes', icon: 'crown', maxProgress: 100 },

    // Score-based Achievements
    { id: 'score-90', title: 'High Scorer', description: 'Achieve 90% or higher on any quiz', icon: 'target', maxProgress: 1 },
    { id: 'score-95', title: 'Expert', description: 'Achieve 95% or higher on any quiz', icon: 'bullseye', maxProgress: 1 },
    { id: 'perfect-score', title: 'Perfectionist', description: 'Achieve a perfect score on any quiz', icon: 'diamond', maxProgress: 1 },

    // Streak Achievements
    { id: 'streak-5', title: 'On Fire', description: 'Get 5 consecutive good scores (70%+)', icon: 'fire', maxProgress: 5 },
    { id: 'streak-10', title: 'Unstoppable', description: 'Get 10 consecutive good scores', icon: 'flame', maxProgress: 10 },
    { id: 'streak-20', title: 'Legendary Streak', description: 'Get 20 consecutive good scores', icon: 'inferno', maxProgress: 20 },

    // Category Mastery (will be dynamically added)
  ];

  constructor(private progressService: ProgressService) {
    this.achievementsSubject = new BehaviorSubject<Achievement[]>(this.getAllAchievements());
    this.achievements$ = this.achievementsSubject.asObservable();

    // Subscribe to progress changes and check for new achievements
    this.progressService.progress$.subscribe(progress => {
      this.checkAchievements(progress);
    });

    // Initial check
    this.checkAchievements(this.progressService.getAllProgress());
  }

  // Get all achievements with current status
  getAllAchievements(): Achievement[] {
    const stored = this.getStoredAchievements();
    const allAchievements = this.achievementDefinitions.map(def => {
      const storedAchievement = stored.find(a => a.id === def.id);
      return storedAchievement || { ...def, unlocked: false, progress: 0 };
    });

    // Add category-specific achievements
    const categories = this.getUniqueCategories();
    categories.forEach(category => {
      const categoryAchievement: Achievement = {
        id: `mastery-${category.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${category} Master`,
        description: `Achieve 90%+ average in ${category} with at least 5 quizzes`,
        icon: 'master',
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        category
      };
      allAchievements.push(categoryAchievement);
    });

    return allAchievements;
  }

  // Check and update achievements based on current progress
  private checkAchievements(progress: QuizProgress[]): void {
    const currentAchievements = this.getAllAchievements();
    let hasChanges = false;

    // Quiz completion achievements
    const totalQuizzes = progress.length;
    const completionAchievements = [
      { id: 'first-quiz', threshold: 1 },
      { id: 'quiz-10', threshold: 10 },
      { id: 'quiz-25', threshold: 25 },
      { id: 'quiz-50', threshold: 50 },
      { id: 'quiz-100', threshold: 100 }
    ];

    completionAchievements.forEach(({ id, threshold }) => {
      const achievement = currentAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        achievement.progress = Math.min(totalQuizzes, threshold);
        if (totalQuizzes >= threshold && !achievement.unlocked) {
          this.unlockAchievement(achievement);
          hasChanges = true;
        }
      }
    });

    // Score-based achievements
    const highScores = progress.filter(p => (p.score / p.maxScore) * 100 >= 90);
    const expertScores = progress.filter(p => (p.score / p.maxScore) * 100 >= 95);
    const perfectScores = progress.filter(p => p.score === p.maxScore);

    const scoreAchievements = [
      { id: 'score-90', condition: highScores.length > 0 },
      { id: 'score-95', condition: expertScores.length > 0 },
      { id: 'perfect-score', condition: perfectScores.length > 0 }
    ];

    scoreAchievements.forEach(({ id, condition }) => {
      const achievement = currentAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked && condition) {
        this.unlockAchievement(achievement);
        hasChanges = true;
      }
    });

    // Streak achievements
    const currentStreak = this.calculateCurrentStreak(progress);
    const streakAchievements = [
      { id: 'streak-5', threshold: 5 },
      { id: 'streak-10', threshold: 10 },
      { id: 'streak-20', threshold: 20 }
    ];

    streakAchievements.forEach(({ id, threshold }) => {
      const achievement = currentAchievements.find(a => a.id === id);
      if (achievement) {
        achievement.progress = Math.min(currentStreak, threshold);
        if (currentStreak >= threshold && !achievement.unlocked) {
          this.unlockAchievement(achievement);
          hasChanges = true;
        }
      }
    });

    // Category mastery achievements
    const categories = this.getUniqueCategories();
    categories.forEach(category => {
      const categoryProgress = progress.filter(p => p.category === category);
      if (categoryProgress.length >= 5) {
        const averageScore = categoryProgress.reduce((acc, p) => acc + (p.score / p.maxScore), 0) / categoryProgress.length * 100;
        const achievementId = `mastery-${category.toLowerCase().replace(/\s+/g, '-')}`;
        const achievement = currentAchievements.find(a => a.id === achievementId);
        if (achievement) {
          achievement.progress = Math.min(categoryProgress.length, 5);
          if (averageScore >= 90 && !achievement.unlocked) {
            this.unlockAchievement(achievement);
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges) {
      this.saveAchievements(currentAchievements);
      this.achievementsSubject.next(currentAchievements);
    }
  }

  // Unlock an achievement
  private unlockAchievement(achievement: Achievement): void {
    achievement.unlocked = true;
    achievement.unlockedDate = new Date().toISOString();
    achievement.progress = achievement.maxProgress;
  }

  // Calculate current streak of good scores (70%+)
  private calculateCurrentStreak(progress: QuizProgress[]): number {
    const sortedProgress = progress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    for (const p of sortedProgress) {
      const score = (p.score / p.maxScore) * 100;
      if (score >= 70) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Get unique categories from progress
  private getUniqueCategories(): string[] {
    const progress = this.progressService.getAllProgress();
    const categories = [...new Set(progress.map(p => p.category).filter(c => c))];
    return categories;
  }

  // Get stored achievements from localStorage
  private getStoredAchievements(): Achievement[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Save achievements to localStorage
  private saveAchievements(achievements: Achievement[]): void {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    localStorage.setItem(this.storageKey, JSON.stringify(unlockedAchievements));
  }

  // Get only unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlocked);
  }

  // Get achievement by ID
  getAchievementById(id: string): Achievement | undefined {
    return this.getAllAchievements().find(a => a.id === id);
  }

  // Reset all achievements (for testing)
  resetAchievements(): void {
    localStorage.removeItem(this.storageKey);
    this.achievementsSubject.next(this.getAllAchievements());
  }
}
