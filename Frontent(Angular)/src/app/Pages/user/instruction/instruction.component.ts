import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../service/quiz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { StorageUtil } from '../../../utils/storage.util';

@Component({
  selector: 'app-instruction',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatListModule, MatDividerModule, MatIconModule],
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
})
export class InstructionComponent {
  qId: any;
  quiz: any;
  isDarkMode: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _quizService: QuizService,
    private _snack: MatSnackBar,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.qId = this._route.snapshot.params['qid'];

    // Load theme preference from localStorage
    const savedTheme = StorageUtil.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme(this.isDarkMode);
    }

    this._quizService.getQuiz(this.qId).subscribe(
      (data: any) => {
        this.quiz = data;
      },
      (error: any) => {
        console.log(error);
        this._snack.open('Error in loading quiz', '', {
          duration: 2000,
        });
      }
    );
  }

  startQuiz() {
    Swal.fire({
      title: 'Do you want to start the quiz ?',
      text: "You won't be able to revert this!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Start',
    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['/start/' + this.qId]);
      }
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    console.log('Toggling theme to:', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme(this.isDarkMode);
    StorageUtil.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }
}
