import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageUtil } from '../../utils/storage.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  categories: any;
  hideNavbar = false;
  mobileMenuOpen = false;
  mobileCategoriesOpen = false;
  isDarkMode = false;

  isLoggedIn = false;
  user: any = null;
  isLoggingOut = false;

  constructor(
    public login: LoginService,
    private _cat: CategoryService,
    private _snack: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.asObservable().subscribe(
      (data) => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );

    // Check if current route is start component
    this.router.events.subscribe(() => {
      this.hideNavbar = this.router.url.startsWith('/start');

      // Force light mode on home, login, and register pages
      const lightModeRoutes = ['/', '/login', '/register'];
      if (lightModeRoutes.includes(this.router.url)) {
        this.isDarkMode = false;
        this.applyTheme(false);
      } else {
        // Load theme preference from localStorage or system preference
        const savedTheme = StorageUtil.getItem('theme');
        if (savedTheme) {
          this.isDarkMode = savedTheme === 'dark';
        } else {
          // Use prefers-color-scheme media query only if window is defined (browser)
          if (typeof window !== 'undefined' && window.matchMedia) {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          } else {
            this.isDarkMode = false; // default to light mode in SSR or unknown environment
          }
        }
        this.applyTheme(this.isDarkMode);
      }
    });

    // Loading Category in Sandwich bar menu
    this._cat.categories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        this._snack.open("error loading categories!!", "", {
          duration: 2000
        });
      }
    );
  }

  async logout() {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      // Show loading state
      this.isLoggingOut = true;
      
      // Simulate some loading time (you can remove this if not needed)
      setTimeout(() => {
        this.login.logOut();
        this.login.loginStatusSubject.next(false);
        this.router.navigate(['/']);
        this.isLoggingOut = false;
      }, 1000); // 1 second loading simulation
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.mobileCategoriesOpen = false;
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.mobileCategoriesOpen = false;
  }

  toggleMobileCategories() {
    this.mobileCategoriesOpen = !this.mobileCategoriesOpen;
  }

  toggleTheme() {
    // Prevent toggling dark mode on home, login, and register pages
    const lightModeRoutes = ['/', '/login', '/register'];
    if (lightModeRoutes.includes(this.router.url)) {
      return;
    }

    this.isDarkMode = !this.isDarkMode;
    console.log('Toggling theme to:', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme(this.isDarkMode);
    StorageUtil.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme(isDark: boolean) {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
    }
  }
}
