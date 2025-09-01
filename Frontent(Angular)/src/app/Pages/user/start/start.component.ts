import { LocationStrategy } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';



import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../service/question.service';
import { ProgressService, QuizProgress } from '../../../service/progress.service';
import { ShuffleUtil } from '../../../utils/shuffle.util';
import { StorageUtil } from '../../../utils/storage.util';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-start',
  imports: [
    MatProgressSpinnerModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatDividerModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class StartComponent implements OnInit, OnDestroy {
  qid: any;
  questions: any[] = [];
  isSubmit = false;
  attempted = 0;
  marksGot = 0;
  correctAns = 0;
  timer: number = 0; // seconds left
  private timerInterval: any; // interval reference

  constructor(
    private locationSt: LocationStrategy,
    private _route: ActivatedRoute,
    private _questionService: QuestionService,
    private progressService: ProgressService
  ) {}

  private preventRightClick() {
    document.addEventListener('contextmenu', this.disableContextMenu);
  }

  private disableContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  ngOnInit(): void {
    // this.preventRightClick();
    this.preventBackButton();
    this.qid = this._route.snapshot.params['qid'];
    this.loadQuestions();
  }

  updateOptionButtonState(question: any, optionValue: string): void {
    if (question.givenAns === optionValue) {
      question.givenAns = ''; // Unselect if already selected
    } else {
      question.givenAns = optionValue; // Select the new option
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('contextmenu', this.disableContextMenu);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadQuestions() {
    this.isSubmit = false;
    this.correctAns = 0;
    this.marksGot = 0;
    this.attempted = 0;

    this._questionService.getQuestionsOfQuizForTest(this.qid).subscribe(
      (data: any) => {
        this.questions = ShuffleUtil.shuffleArray(data);
        this.questions = this.questions.map((question: any) => {
          return ShuffleUtil.shuffleQuestionOptions(question);
        });
        this.timer = this.questions.length * 2 * 60;
        this.questions.forEach((q: any) => {
          q['givenAns'] = '';
        });
        this.startTimer();
      },
      (error: any) => {
        Swal.fire('Error', 'Error in loading questions of quiz', 'error');
      }
    );
  }

  startTimer() {
    const storageKey = `quiz_timer_${this.qid}`;
    const now = Date.now();

    // Check if a start time is already stored
    let startTime = StorageUtil.getItem(storageKey);

    if (!startTime) {
      // Store quiz start time if not already stored
      startTime = now.toString();
      StorageUtil.setItem(storageKey, startTime);
    }

    // Calculate remaining time
    const quizDuration = this.questions.length * 2 * 60 * 1000; // in ms
    const elapsed = now - parseInt(startTime, 10);
    let remaining = Math.floor((quizDuration - elapsed) / 1000);

    // If already time up
    if (remaining <= 0) {
      this.timer = 0;
      clearInterval(this.timerInterval);
      StorageUtil.removeItem(storageKey);
      this.evalQuiz();
      return;
    }

this.timer = remaining <= 0 ? 0 : remaining;

// Add visual cue for low time
if (this.timer <= 60) {
  Swal.fire({
    title: 'Time is running out!',
    text: 'You have less than a minute left.',
    icon: 'warning',
    timer: 5000,
    timerProgressBar: true,
    willClose: () => {
      clearInterval(this.timerInterval);
    }
  });
}

    // Start ticking
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        StorageUtil.removeItem(storageKey);
        this.evalQuiz();
      }
    }, 1000);
  }
  getFormattedTime() {
    const hh = Math.floor(this.timer / 3600);
    const mm = Math.floor((this.timer % 3600) / 60);
    const ss = this.timer % 60;
    return `${hh.toString().padStart(2, '0')}:${mm
      .toString()
      .padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  submitQuiz() {
    Swal.fire({
      title: 'Do you want to submit the quiz?',
      text: "You won't be able to revert this!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed) {
        this.evalQuiz();
      }
    });
  }

  evalQuiz() {
    this.isSubmit = true;
    this.correctAns = 0;
    this.marksGot = 0;
    this.attempted = 0;

    // Calculate start time for time spent tracking
    const storageKey = `quiz_timer_${this.qid}`;
    const startTimeStr = StorageUtil.getItem(storageKey);
    const startTime = startTimeStr ? parseInt(startTimeStr, 10) : Date.now();
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    this.questions.forEach((q: any) => {
      if (q.givenAns === q.answer) {
        this.correctAns++;
        const marksSingle =
          this.questions[0].quiz.maxMarks /
          this.questions[0].quiz.numberOfQuestions;
        this.marksGot += marksSingle;
      }
      if (q.givenAns && q.givenAns.trim() !== '') {
        this.attempted++;
      }
    });

    // Extract quiz metadata
    const quizTitle = this.questions[0]?.quiz?.title || `Quiz ${this.qid}`;
    const maxScore = this.questions[0]?.quiz?.maxMarks || this.questions.length;

    // Calculate most frequent category and difficulty
    const categoryCounts: { [key: string]: number } = {};
    const difficultyCounts: { [key: string]: number } = {};

    this.questions.forEach((question: any) => {
      const category = question.category || 'General';
      const difficulty = question.difficulty || 'Medium';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
    });

    const mostFrequentCategory = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b, 'General');

    const mostFrequentDifficulty = Object.keys(difficultyCounts).reduce((a, b) =>
      difficultyCounts[a] > difficultyCounts[b] ? a : b, 'Medium');

    // Create and save progress
    const progress: QuizProgress = {
      quizId: parseInt(this.qid, 10),
      quizTitle: quizTitle,
      score: this.correctAns,
      maxScore: maxScore,
      date: new Date().toISOString(),
      timeSpent: timeSpentSeconds,
      category: mostFrequentCategory,
      difficulty: mostFrequentDifficulty
    };

    this.progressService.saveProgress(progress);

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    StorageUtil.removeItem(storageKey);
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }

}
