import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { iif } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginService } from '../../service/login.service';
import { error, log } from 'console';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent  {
  loginData = {
    username:'',
    password:'',
  };
  hidePassword = true;
  
  private snackBar = inject(MatSnackBar);
  private login = inject(LoginService);
  private router = inject(Router);

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


  formSubmit() {
    console.log('login button clicked');
    if (
      this.loginData.username.trim() == '' ||
      this.loginData.username == null
    ) {
      this.snackBar.open('Username is required!!', '', {
        duration: 3000,
      });
      return;
    }
    if (
      this.loginData.password.trim() == '' ||
      this.loginData.password == null
    ) {
      this.snackBar.open('password is required!!', '', {
        duration: 3000,
      });
      return;
    }

    //request token to the server
    this.login.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log('success');
        console.log(data);

        // Login...
        this.login.loginUser(data.token);
    

this.login.getCurrentUser().subscribe(
  (user: any) => {
    
    if (!user) {
      console.error('Received null or empty user from backend');
    }
    this.login.setUser(user);

    // redirect...ADMIN: admin-dashboard
    // redirect...NORMAL: normal-dashboard
    if (this.login.getUserRole() == 'ROLE_ADMIN') {
      this.router.navigate(['admin-dashboard']);
      this.login.loginStatusSubject.next(true);
    } else if (this.login.getUserRole() == 'ROLE_NORMAL') {
      this.router.navigate(['user-dashboard/0']);
      this.login.loginStatusSubject.next(true);
    } else {
      this.login.logOut();
    }
  },
  (error) => {
    console.error('Error fetching user:', error);
    this.snackBar.open('Invalid Login', '', {
      duration: 3000,
    });
  }
);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }



}
