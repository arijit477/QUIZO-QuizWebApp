import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../service/category.service';
import { QuizService } from '../../../service/quiz.service';
import e from 'express';

@Component({
  selector: 'app-add-quiz',
  imports: [
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.css',
})
export class AddQuizComponent {
  categories = [
    {
      cid: '',
      title: '',
    },
  ];

  quizData = {
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    active: 'true',
    category: {
      cid: '',
    },
  };

  constructor(
    private _cat: CategoryService,
    private _snack: MatSnackBar,
    private _quizService: QuizService
  ) {}

  ngOnInit(): void {
    this._cat.categories().subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error) => {
        console.error(error);
        Swal.fire('Error !!', 'No Category to Select! ', 'error');
      }
    );
  }

  addQuiz() {
    if (this.quizData.title.trim() == '' || this.quizData.title == null) {
      this._snack.open('Please enter Quiz title!', '', {
        duration: 2000,
      });
      return;
    }
    //call server

    this._quizService.addQuiz(this.quizData).subscribe(
      (data: any) => {
        this.quizData = data;
        console.log(data);
        Swal.fire('Success !!', 'Quiz added successfully', 'success');
        this.quizData = {
          title: '',
          description: '',
          maxMarks: '',
          numberOfQuestions: '',
          active: 'true',
          category: {
            cid: '',
          },
        };
      },
      (error) => {
        Swal.fire('Error !!', 'Category not added', 'error');
        console.log(error);
      }
    );
  }
}
