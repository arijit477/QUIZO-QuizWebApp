import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private router = inject(Router);
  private loginService = inject(LoginService);

  constructor() {
    // Check if user is already logged in
    if (this.loginService.isLoggedIn()) {
      const userRole = this.loginService.getUserRole();
      
      if (userRole === 'ROLE_NORMAL') {
        // Redirect normal users directly to load-quiz component (catId=0 for all quizzes)
        this.router.navigate(['/user-dashboard/0']);
      } else if (userRole === 'ROLE_ADMIN') {
        // Redirect admin users to admin dashboard
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
