import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../../service/login.service';
import { ProgressService, QuizProgress, ProgressSummary } from '../../../service/progress.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { ProgressChartComponent } from '../../../Components/progress-chart/progress-chart.component';
import { AchievementsComponent } from '../../../Components/achievements/achievements.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, MatCardModule, MatTableModule, MatButtonModule, ProgressChartComponent, AchievementsComponent]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user?: any;
  progressSummary: ProgressSummary = {
    totalQuizzes: 0,
    averageScore: '0.00',
    totalTimeSpent: 0,
    bestScore: 0,
    worstScore: 0,
    categoryStats: {},
    difficultyStats: {}
  };
  allProgress: QuizProgress[] = [];
  showProgressDetails: boolean = false;
  activeTab: string = 'overview';
  isSampleData: boolean = false;

  private progressSubscription?: Subscription;

  constructor(
    private login: LoginService,
    public progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.user = this.login.getUser();

    // If no user is logged in, generate sample user data
    if (!this.user) {
      this.user = this.generateSampleUser();
      this.isSampleData = true;
    }

    this.loadProgressData();

    // Subscribe to progress updates for real-time updates
    this.progressSubscription = this.progressService.progress$.subscribe(() => {
      this.loadProgressData();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  trackByQuizId(index: number, item: QuizProgress): number {
    return item.quizId;
  }

  // Generate sample user data for demonstration
  private generateSampleUser() {
    return {
      id: 12345,
      firstName: 'Sample',
      lastName: 'User',
      username: 'sampleuser',
      phone: '123-456-7890',
      enabled: true,
      authorities: [{ authority: 'ROLE_USER' }]
    };
  }

  loadProgressData(): void {
    this.progressSummary = this.progressService.getProgressSummary();
    this.allProgress = this.progressService.getAllProgress();
  }

  toggleProgressDetails(): void {
    this.showProgressDetails = !this.showProgressDetails;
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.progressSummary.categoryStats || {});
  }

  getDifficultyKeys(): string[] {
    return Object.keys(this.progressSummary.difficultyStats || {});
  }

  // Expose Object to template
  public Object = Object;

  // Angular-native tab switching
  switchTab(tabId: string): void {
    this.activeTab = tabId;

    // If switching to history tab and details are shown, ensure they're visible
    if (tabId === 'history' && this.showProgressDetails) {
      setTimeout(() => {
        const historyContent = document.querySelector('.history-content');
        if (historyContent) {
          historyContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  // Method to programmatically switch tabs (for testing)
  setActiveTab(tab: string): void {
    this.switchTab(tab);
  }

  // Export progress data
  exportProgress(): void {
    this.progressService.downloadProgressData();
  }

  // Import progress data
  importProgress(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const result = this.progressService.importProgressData(content);

        if (result.success) {
          // Show success message
          alert(result.message);
          // Reload progress data
          this.loadProgressData();
        } else {
          // Show error message
          alert('Import failed: ' + result.message);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    event.target.value = '';
  }

  // Clear all progress data
  clearAllProgress(): void {
    if (confirm('Are you sure you want to clear all progress data? This action cannot be undone.')) {
      this.progressService.clearProgress();
      this.loadProgressData();
    }
  }

  // Share profile functionality - shares the profile link
  shareProfile(): void {
    const profileUrl = window.location.href;
    const shareTitle = `Check out ${this.user.firstName} ${this.user.lastName}'s QUIZO Profile`;
    const shareText = `Check out my QUIZO profile and see my quiz progress!`;

    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: profileUrl
      }).catch((error) => {
        console.log('Error sharing:', error);
        this.fallbackShare(profileUrl);
      });
    } else {
      this.fallbackShare(profileUrl);
    }
  }

  // Fallback sharing method (copy to clipboard)
  private fallbackShare(profileUrl: string): void {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(profileUrl).then(() => {
        alert('Profile link copied to clipboard! You can now paste it anywhere to share.');
      }).catch((err) => {
        console.error('Failed to copy to clipboard:', err);
        this.showProfileLinkDialog(profileUrl);
      });
    } else {
      this.showProfileLinkDialog(profileUrl);
    }
  }

  // Show profile link in a dialog for manual copying
  private showProfileLinkDialog(profileUrl: string): void {
    const dialogText = `Your profile link:\n\n${profileUrl}\n\nCopy and share this link!`;
    alert(dialogText);
  }

  // Update profile functionality
  updateProfile(): void {
    // For now, show a simple alert. This can be expanded to navigate to an edit profile page
    // or open a modal dialog for editing profile information
    alert('Update Profile feature coming soon!\n\nThis will allow you to edit your personal information, change your password, and update your profile picture.');

    // TODO: Implement actual profile update functionality
    // This could include:
    // 1. Navigate to an edit profile page
    // 2. Open a modal dialog
    // 3. Call a service to update user information
    // 4. Handle form validation and submission
  }

}
