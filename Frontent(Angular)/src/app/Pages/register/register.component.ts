import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    HttpClientModule
],
  providers: [UserService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  
  hidePassword = true;

  constructor(private userService: UserService) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (
      !this.user.username ||
      !this.user.password ||
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.user.phone
    ) {
      alert('Please fill in all fields');
      return;
    }
    this.userService.addUser(this.user).subscribe(
      (data) => {
        Swal.fire({
  title: "Success!",
  text: "You Register Successfully!",
  icon: "success"
});
        console.log(data);
      },
      (error) => {
        console.log(error);
        alert('Something went wrong!');
      }
    );
  }

  clearForm() {
    this.user = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
  }
}
