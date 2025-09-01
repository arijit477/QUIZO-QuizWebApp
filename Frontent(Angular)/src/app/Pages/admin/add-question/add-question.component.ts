import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { QuestionService } from '../../../service/question.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    FormsModule,
    CKEditorModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    TextFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
})
export class AddQuestionComponent {
  //CK Rich text editor Variable
  public Editor: any = null;
  qId: any;
  qTitle: any;
  quesId: any;
  isUpdate: boolean = false;
  question = {
    quesId: '',
    quiz: {
      qid: '',
    },
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  };

  constructor(
    private _route: ActivatedRoute,
    private _questionService: QuestionService,
    private _snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const ClassicEditorModule = await import('@ckeditor/ckeditor5-build-classic');
      this.Editor = ClassicEditorModule.default;
    }

    this.qId = this._route.snapshot.paramMap.get('qid');
    this.qTitle = this._route.snapshot.paramMap.get('title');
    this.quesId = this._route.snapshot.paramMap.get('quesId');

    this.question.quiz['qid'] = this.qId;

    if (this.quesId) {
      this.isUpdate = true;
      this._questionService.getQuestion(this.quesId).subscribe(
        (data: any) => {
          this.question = data;
        },
        (error) => {
          this._snackBar.open('Error loading question data', '', {
            duration: 3000,
          });
        }
      );
    }
  }

  // /submit method

  public submitQuestion() {
    //validate
    if (this.question.content.trim() == '' || this.question.content == null) {
      this._snackBar.open('Please enter Quiz title!', '', {
        duration: 2000,
      });
      return;
    }
    if (this.question.option1.trim() == '' || this.question.option1 == null) {
      this._snackBar.open('Please enter atleast two option!', '', {
        duration: 2000,
      });
      return;
    }
    if (this.question.option2.trim() == '' || this.question.option2 == null) {
      this._snackBar.open('Please enter atleast two option!!', '', {
        duration: 2000,
      });
      return;
    }
    if (this.question.answer.trim() == '' || this.question.answer == null) {
      this._snackBar.open('Please Select Answer!!', '', {
        duration: 2000,
      });
      return;
    }

    if (this.isUpdate) {
      this._questionService.updateQuestion(this.question).subscribe(
        (data: any) => {
          Swal.fire(
            'Updated !!',
            'Question Updated successfully!',
            'success'
          ).then(() => {
            this.router.navigate([
              '/admin-dashboard/view-questions',
              this.qId,
              this.qTitle,
            ]);
          });
        },
        (error) => {
          Swal.fire('Error !!', 'Error in updating question!', 'error');
          console.log(error);
        }
      );
    } else {
      this._questionService.addQuestion(this.question).subscribe(
        (data: any) => {
          Swal.fire('Added !!', 'Question Added successfully!', 'success');
          //reset data of question
          this.question.content = '';
          this.question.option1 = '';
          this.question.option2 = '';
          this.question.option3 = '';
          this.question.option4 = '';
          this.question.answer = '';
        },
        (error) => {
          Swal.fire('Error !!', 'Error in adding question!', 'error');
          console.log(error);
        }
      );
    }
  }
}
