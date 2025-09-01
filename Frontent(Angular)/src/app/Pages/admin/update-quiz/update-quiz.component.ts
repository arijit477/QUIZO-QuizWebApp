import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../service/category.service';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


import { QuizService } from '../../../service/quiz.service';

@Component({
  selector: 'app-update-quiz',
  imports: [
    TextFieldModule,
    NgIf,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.css',
})
export class UpdateQuizComponent {
  qId = 0;
  quiz: any;
  categories: any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _quizService: QuizService,
    private _cat: CategoryService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.qId = this._route.snapshot.params['qid'];

    this._cat.categories().subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error) => {
        console.error(error);
        alert('Error in loading Category!!');
      }
    );

    this._quizService.getQuiz(this.qId).subscribe(
      (data: any) => {
        this.quiz = data;
        console.log(data);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  //Update on from submit

  public updateData() {
    //validate
    if (this.quiz.title.trim() == '' || this.quiz.title == null) {
      this._snackBar.open('Please enter Quiz title!', '', {
        duration: 2000,
      });
      return;
    }
    //call server

    this._quizService.updateQuiz(this.quiz).subscribe(
      (data: any) => {
        Swal.fire('Updated !!', 'Quiz updated successfully!', 'success').then(
          (e) => {
            this._router.navigate(['/admin-dashboard/view-quizzes']);
          }
        );
      },
      (error: any) => {
        Swal.fire('Error !!', 'Error in Updating Quiz!', 'error');
        console.log(error);
      }
    );
  }
}
