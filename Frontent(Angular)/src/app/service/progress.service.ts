import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface QuizProgress {
  quizId: number;
  quizTitle: string;
  score: number;
  maxScore: number;
  date: string; // ISO string
  timeSpent: number; // in seconds
  category: string;
  difficulty: string;
}

export interface ProgressSummary {
  totalQuizzes: number;
  averageScore: string;
  totalTimeSpent: number;
  bestScore: number;
  worstScore: number;
  categoryStats: { [key: string]: { count: number, average: number } };
  difficultyStats: { [key: string]: { count: number, average: number } };
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private storageKey = 'userQuizProgress';

  private progressSubject = new BehaviorSubject<QuizProgress[]>(this.getAllProgress());
  progress$ = this.progressSubject.asObservable();

  constructor() {
    // Initialize with existing data
  }

  // Save quiz progress for a user
  saveProgress(progress: QuizProgress): void {
    const allProgress = this.getAllProgress();
    allProgress.push(progress);
    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
    this.progressSubject.next(allProgress);
  }

  // Get all quiz progress records
  getAllProgress(): QuizProgress[] {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data) as QuizProgress[];
    }
    
    // Return empty array if no real data exists - no more sample data
    return [];
  }

  // Get progress summary with enhanced statistics
  getProgressSummary(): ProgressSummary {
    const allProgress = this.getAllProgress();
    const totalQuizzes = allProgress.length;
    
    if (totalQuizzes === 0) {
      return {
        totalQuizzes: 0,
        averageScore: '0.00',
        totalTimeSpent: 0,
        bestScore: 0,
        worstScore: 0,
        categoryStats: {},
        difficultyStats: {}
      };
    }

    const totalScore = allProgress.reduce((acc, cur) => acc + cur.score, 0);
    const totalMaxScore = allProgress.reduce((acc, cur) => acc + cur.maxScore, 0);
    const averageScore = totalScore / totalMaxScore * 100;
    const totalTimeSpent = allProgress.reduce((acc, cur) => acc + (cur.timeSpent || 0), 0);
    
    const scores = allProgress.map(p => (p.score / p.maxScore) * 100);
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Category statistics
    const categoryStats: { [key: string]: { count: number, totalScore: number } } = {};
    allProgress.forEach(progress => {
      const category = progress.category || 'Uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, totalScore: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].totalScore += (progress.score / progress.maxScore) * 100;
    });

    // Difficulty statistics
    const difficultyStats: { [key: string]: { count: number, totalScore: number } } = {};
    allProgress.forEach(progress => {
      const difficulty = progress.difficulty || 'Unknown';
      if (!difficultyStats[difficulty]) {
        difficultyStats[difficulty] = { count: 0, totalScore: 0 };
      }
      difficultyStats[difficulty].count++;
      difficultyStats[difficulty].totalScore += (progress.score / progress.maxScore) * 100;
    });

    // Calculate averages
    const formattedCategoryStats: { [key: string]: { count: number, average: number } } = {};
    Object.keys(categoryStats).forEach(category => {
      formattedCategoryStats[category] = {
        count: categoryStats[category].count,
        average: categoryStats[category].totalScore / categoryStats[category].count
      };
    });

    const formattedDifficultyStats: { [key: string]: { count: number, average: number } } = {};
    Object.keys(difficultyStats).forEach(difficulty => {
      formattedDifficultyStats[difficulty] = {
        count: difficultyStats[difficulty].count,
        average: difficultyStats[difficulty].totalScore / difficultyStats[difficulty].count
      };
    });

    return {
      totalQuizzes,
      averageScore: averageScore.toFixed(2),
      totalTimeSpent,
      bestScore,
      worstScore,
      categoryStats: formattedCategoryStats,
      difficultyStats: formattedDifficultyStats
    };
  }

  // Get recent progress (last 10 quizzes)
  getRecentProgress(limit: number = 10): QuizProgress[] {
    const allProgress = this.getAllProgress();
    return allProgress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Clear all progress
  clearProgress(): void {
    localStorage.removeItem(this.storageKey);
    this.progressSubject.next([]);
  }

  // Clear any existing sample data and start fresh
  clearSampleData(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const progressData = JSON.parse(data) as QuizProgress[];
      
      // Check for any sample data patterns and remove ALL progress data if found
      const hasSampleData = progressData.some(progress => 
        // Check for sample quiz titles
        progress.quizTitle.includes('JavaScript Fundamentals') ||
        progress.quizTitle.includes('Advanced Algorithms') ||
        progress.quizTitle.includes('Basic Mathematics') ||
        progress.quizTitle.includes('World History') ||
        progress.quizTitle.includes('Physics Concepts') ||
        progress.quizTitle.includes('HTML & CSS Basics') ||
        progress.quizTitle.includes('Chemistry Elements') ||
        progress.quizTitle.includes('Geometry Principles') ||
        // Check for sample quiz IDs (1-8)
        (progress.quizId >= 1 && progress.quizId <= 8) ||
        // Check for specific date patterns (older than current implementation)
        new Date(progress.date) < new Date('2024-01-01')
      );
      
      if (hasSampleData) {
        console.log('Sample data detected - clearing all progress data');
        localStorage.removeItem(this.storageKey);
        this.progressSubject.next([]);
      }
    }
  }

  // Get progress by category
  getProgressByCategory(category: string): QuizProgress[] {
    return this.getAllProgress().filter(progress => progress.category === category);
  }

  // Get progress by difficulty
  getProgressByDifficulty(difficulty: string): QuizProgress[] {
    return this.getAllProgress().filter(progress => progress.difficulty === difficulty);
  }

  // Get time spent formatted (hours:minutes:seconds)
  formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Get performance trend (last 5 quizzes)
  getPerformanceTrend(): number[] {
    const recentProgress = this.getRecentProgress(5);
    return recentProgress.map(progress => (progress.score / progress.maxScore) * 100);
  }

  // Export progress data as JSON string
  exportProgressData(): string {
    const allProgress = this.getAllProgress();
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      totalRecords: allProgress.length,
      data: allProgress
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import progress data from JSON string
  importProgressData(jsonData: string): { success: boolean, message: string, importedCount?: number } {
    try {
      const importData = JSON.parse(jsonData);

      // Validate import data structure
      if (!importData.data || !Array.isArray(importData.data)) {
        return { success: false, message: 'Invalid data format. Expected array of progress records.' };
      }

      // Validate each progress record
      const validRecords: QuizProgress[] = [];
      const invalidRecords: any[] = [];

      importData.data.forEach((record: any, index: number) => {
        if (this.isValidProgressRecord(record)) {
          validRecords.push(record);
        } else {
          invalidRecords.push({ index, record });
        }
      });

      if (validRecords.length === 0) {
        return { success: false, message: 'No valid progress records found in the import data.' };
      }

      // Get existing progress and merge with imported data
      const existingProgress = this.getAllProgress();
      const mergedProgress = [...existingProgress, ...validRecords];

      // Remove duplicates based on quizId and date
      const uniqueProgress = this.removeDuplicates(mergedProgress);

      // Save the merged data
      localStorage.setItem(this.storageKey, JSON.stringify(uniqueProgress));
      this.progressSubject.next(uniqueProgress);

      const message = `Successfully imported ${validRecords.length} progress records. ${invalidRecords.length > 0 ? `${invalidRecords.length} invalid records were skipped.` : ''}`;

      return {
        success: true,
        message,
        importedCount: validRecords.length
      };

    } catch (error) {
      return { success: false, message: `Error parsing import data: ${error}` };
    }
  }

  // Validate a progress record
  private isValidProgressRecord(record: any): boolean {
    return (
      record &&
      typeof record.quizId === 'number' &&
      typeof record.quizTitle === 'string' &&
      typeof record.score === 'number' &&
      typeof record.maxScore === 'number' &&
      typeof record.date === 'string' &&
      typeof record.timeSpent === 'number' &&
      typeof record.category === 'string' &&
      typeof record.difficulty === 'string' &&
      record.score >= 0 &&
      record.maxScore > 0 &&
      record.timeSpent >= 0 &&
      new Date(record.date).toString() !== 'Invalid Date'
    );
  }

  // Remove duplicate progress records
  private removeDuplicates(progress: QuizProgress[]): QuizProgress[] {
    const seen = new Set<string>();
    return progress.filter(record => {
      const key = `${record.quizId}-${record.date}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Download progress data as file
  downloadProgressData(): void {
    const data = this.exportProgressData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-progress-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }
}
