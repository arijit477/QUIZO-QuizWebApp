import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService, Achievement } from '../../service/achievement.service';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  achievements: Achievement[] = [];

  constructor(private achievementService: AchievementService) {}

  ngOnInit(): void {
    this.achievementService.achievements$.subscribe((achievements: Achievement[]) => {
      this.achievements = achievements;
    });
  }

  getIconClass(icon: string): string {
    // Map achievement icons to CSS classes (you can use FontAwesome or custom icons)
    const iconMap: { [key: string]: string } = {
      'trophy': 'fas fa-trophy',
      'star': 'fas fa-star',
      'award': 'fas fa-award',
      'medal': 'fas fa-medal',
      'crown': 'fas fa-crown',
      'target': 'fas fa-target',
      'bullseye': 'fas fa-bullseye',
      'diamond': 'fas fa-diamond',
      'fire': 'fas fa-fire',
      'flame': 'fas fa-flame',
      'inferno': 'fas fa-fire-alt',
      'master': 'fas fa-graduation-cap'
    };
    return iconMap[icon] || 'fas fa-question-circle';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }
}
