import { Component } from '@angular/core';
import { LoadQuizComponent } from "../load-quiz/load-quiz.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-user-dashboard',
  imports: [RouterOutlet ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
