import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavbarComponent } from "./Components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { authInterceptorProviders } from './service/auth.interceptor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxUiLoaderModule,RouterOutlet, MatFormFieldModule, MatInputModule, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authInterceptorProviders]
})
export class AppComponent {
  title = 'quizo';
  
  constructor(public login: LoginService) {
    this.loadTheme();
  }

  loadTheme() {
    if (typeof localStorage !== 'undefined') {
      const isDarkTheme = localStorage.getItem('theme') === 'dark';
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    }
  } // Closing brace added here
  }

  toggleTheme() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    if (isDarkTheme) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
}



