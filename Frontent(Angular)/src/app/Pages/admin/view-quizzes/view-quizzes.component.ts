import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgFor,NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryService } from '../../../service/category.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { QuizService } from '../../../service/quiz.service';

@Component({
  selector: 'app-view-quizzes',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './view-quizzes.component.html',
  styleUrls: ['./view-quizzes.component.css'],
})
export class ViewQuizzesComponent {
  quizzes = [
    {
      qid: '',
      title: '',
      description: '',
      maxMarks: '',
      numberOfQuestions: '',
      active: '',
      category: {
        title: '',
      },
    },
  ];

  constructor(private quiz: QuizService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.quiz.getQuizzes().subscribe(
      (data: any) => {
        this.quizzes = data;
        console.log(data);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error in loading data!',
        });
      }
    );
  }

  //delete quiz on button click
  deleteQuiz(qid: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#039f46ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Find the quiz to be deleted
        const deletedQuiz = this.quizzes.find((quiz) => quiz.qid === qid);
        this.quiz.deleteQuiz(qid).subscribe(
          (data: any) => {
            // Remove the quiz from the list
            this.quizzes = this.quizzes.filter((quiz) => quiz.qid != qid);
            // Show snackbar with Undo option
            let snackBarRef = this._snackBar.open('Quiz deleted successfully!', 'Undo', {
              duration: 3000,
            });
            // Handle Undo action
            snackBarRef.onAction().subscribe(() => {
              if (deletedQuiz) {
                // Call backend to re-add the deleted quiz
                // Remove qid to avoid conflict on re-adding
                const quizToAdd: any = { ...deletedQuiz };
                delete quizToAdd.qid;
                this.quiz.addQuiz(quizToAdd).subscribe(
                  (data: any) => {
                    // Update UI with restored quiz
                    this.quizzes.push(data);
                    this.quizzes.sort((a, b) => (a.qid > b.qid ? 1 : -1));
                  },
                  (error: any) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Failed to restore quiz!',
                    });
                  }
                );
              }
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error in deleting quiz!!',
            });
          }
        );
      }
    });
  }
}
