import { Component } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { LoginService } from '../../service/login.service';
import { ProgressService, QuizProgress } from '../../service/progress.service';

@Component({
  selector: 'app-profile',
  imports: [NgIf, MatCardModule, MatButtonModule, MatTableModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user?: any;


  constructor(
    private login: LoginService,
    public progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    
    
  }



 
}
