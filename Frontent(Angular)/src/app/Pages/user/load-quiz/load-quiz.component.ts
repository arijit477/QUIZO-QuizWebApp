import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../service/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-load-quiz',
  imports: [RouterLink,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './load-quiz.component.html',
  styleUrl: './load-quiz.component.css',
})
export class LoadQuizComponent {
  catId: any;
  quizzes: any;
  filteredQuizzes: any;
  isLoading: boolean = true;
  errorMessage: string = '';
  searchQuery: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _quizService: QuizService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('LoadQuizComponent initialized');
    this._route.params.subscribe((params) => {
      this.catId = params['catId'];
      console.log('Route parameter catId:', this.catId);
      
      this.isLoading = true;
      this.errorMessage = '';

      if (this.catId == 0) {
        // load all quizzes
        console.log("Loading all active quizzes");
        this._quizService.getActiveQuizzes().subscribe(
          (data: any) => {
            console.log('Quizzes data received:', data);
            this.quizzes = data;
            this.filteredQuizzes = [...this.quizzes];
            this.isLoading = false;
          },

          (error: any) => {
            console.error('Error loading quizzes:', error);
            this.errorMessage = 'Failed to load quizzes. Please try again.';
            this.isLoading = false;
            this._snackBar.open('Error Loading Quizzes!!', '', {
              duration: 3000,
            });
          }
        );
      } else {
        //load specific quiz
        console.log("Loading quizzes for category:", this.catId);
        this._quizService.getActiveQuizzesOfCategory(this.catId).subscribe(
          (data: any) => {
            console.log('Category quizzes data received:', data);
            this.quizzes =  data;
            this.filteredQuizzes = [...this.quizzes];
            this.isLoading = false;
          },
          (error: any) => {
            console.error('Error loading category quizzes:', error);
            this.errorMessage = 'Failed to load category quizzes. Please try again.';
            this.isLoading = false;
          }
        )
      }
    });
  }

  // Search functionality
  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredQuizzes = [...this.quizzes];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredQuizzes = this.quizzes.filter((quiz: any) => 
      quiz.title.toLowerCase().includes(query) ||
      quiz.description.toLowerCase().includes(query)
    );
  }

  // Clear search
  clearSearch() {
    this.searchQuery = '';
    this.filteredQuizzes = [...this.quizzes];
  }
}
