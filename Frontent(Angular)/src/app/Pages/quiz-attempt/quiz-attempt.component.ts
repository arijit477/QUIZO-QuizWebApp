import { Component } from '@angular/core';
import { ProgressService, QuizProgress } from '../../service/progress.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: string;
}

@Component({
  selector: 'app-quiz-attempt',
  templateUrl: './quiz-attempt.component.html',
  styleUrl: './quiz-attempt.component.css',
  standalone: true,
  imports: [NgIf, NgFor, MatCardModule, MatButtonModule]
})
export class QuizAttemptComponent {
  questions: Question[] = [];

  currentQuestionIndex: number = 0;
  selectedOptionIndex: number | null = null;
  score: number = 0;
  startTime: number = Date.now();

  constructor(private progressService: ProgressService, private router: Router) {}

  selectOption(index: number): void {
    this.selectedOptionIndex = index;
  }

  submitAnswer(): void {
    if (this.selectedOptionIndex === null) {
      alert('Please select an option before submitting.');
      return;
    }

    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (this.selectedOptionIndex === currentQuestion.correctAnswerIndex) {
      this.score++;
    }

    this.selectedOptionIndex = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    const endTime = Date.now();
    const timeSpentSeconds = Math.floor((endTime - this.startTime) / 1000);

    // Calculate most frequent category and difficulty
    const categoryCounts: { [key: string]: number } = {};
    const difficultyCounts: { [key: string]: number } = {};
    
    this.questions.forEach(question => {
      categoryCounts[question.category] = (categoryCounts[question.category] || 0) + 1;
      difficultyCounts[question.difficulty] = (difficultyCounts[question.difficulty] || 0) + 1;
    });

    const mostFrequentCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b, Object.keys(categoryCounts)[0]);
    
    const mostFrequentDifficulty = Object.keys(difficultyCounts).reduce((a, b) => 
      difficultyCounts[a] > difficultyCounts[b] ? a : b, Object.keys(difficultyCounts)[0]);

    const progress: QuizProgress = {
      quizId: Date.now(), // unique id based on timestamp
      quizTitle: `${mostFrequentCategory} Quiz`,
      score: this.score,
      maxScore: this.questions.length,
      date: new Date().toISOString(),
      timeSpent: timeSpentSeconds,
      category: mostFrequentCategory,
      difficulty: mostFrequentDifficulty
    };

    this.progressService.saveProgress(progress);
    alert('Quiz completed! Your score: ' + this.score + '/' + this.questions.length);
    this.router.navigate(['/user-profile']);
  }
}
