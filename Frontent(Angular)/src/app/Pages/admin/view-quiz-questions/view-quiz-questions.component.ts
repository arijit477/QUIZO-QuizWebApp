import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../service/quiz.service';
import { QuestionService } from '../../../service/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-quiz-questions',
  imports: [MatCardModule, MatDivider, NgFor, MatButtonModule, RouterLink],
  templateUrl: './view-quiz-questions.component.html',
  styleUrl: './view-quiz-questions.component.css',
})
export class ViewQuizQuestionsComponent {
  qId: any;
  qTitle: any;
  questions = [
    {
      quesId:'',
      content: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
    },
  ];

  constructor(
    private _route: ActivatedRoute,
    private _questionService: QuestionService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.qId = this._route.snapshot.params['qid'];
    this.qTitle = this._route.snapshot.params['title'];

    this._questionService.getQuestionsOfQuiz(this.qId).subscribe(
      (data: any) => {
        this.questions = data;
      },
      (error: any) => {
        console.log(error);
        this._snackBar.open(error, 'Undo', {
          duration: 3000,
        });
      }
    );
  }

  //Delete Method for question
  deleteQuestion(qid: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#039f46ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Find the question to be deleted
        const deletedQuestion = this.questions.find((q) => q.quesId === qid);
        this._questionService.deleteQuestion(qid).subscribe(
          (data: any) => {
            // Remove the question from the list
            this.questions = this.questions.filter((q) => q.quesId != qid);
            // Show snackbar with Undo option
            let snackBarRef = this._snackBar.open('Question deleted successfully!', 'Undo', {
              duration: 3000,
            });
            // Handle Undo action
            snackBarRef.onAction().subscribe(() => {
              if (deletedQuestion) {
                // Call backend to re-add the deleted question
                // Remove quesId to avoid conflict on re-adding
                const questionToAdd: any = { ...deletedQuestion };
                delete questionToAdd.quesId;
                this._questionService.addQuestion(questionToAdd).subscribe(
                  (data: any) => {
                    // Update UI with restored question
                    this.questions.push(data);
                    this.questions.sort((a, b) => (a.quesId > b.quesId ? 1 : -1));
                  },
                  (error: any) => {
                    console.log('Error restoring question:', error);
                    this._snackBar.open('Failed to restore question!', '', { duration: 3000 });
                  }
                );
              }
            });
          },
          (error: any) => {
            console.log(error);
            this._snackBar.open('Error deleting question!', 'Undo', {
              duration: 3000,
            });
          }
        );
      }
    });
  }

  updateQuestion(quesId: any) {
    // Navigate to add-question component with quesId for update
    // Using router navigation with query params or route params
    // Assuming router is injected
    this.router.navigate(['/admin-dashboard/add-question', this.qId, this.qTitle, quesId]);
  }
}
