import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService, QuizProgress, ProgressSummary } from '../../service/progress.service';
import { Subscription } from 'rxjs';
import { Chart, ChartType, ChartConfiguration, ChartData } from 'chart.js/auto';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProgressChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() chartType: 'performance' | 'category' | 'difficulty' | 'timeline' = 'performance';
  @ViewChild('chartCanvas', { static: false }) chartCanvas?: ElementRef<HTMLCanvasElement>;

  progressData: QuizProgress[] = [];
  progressSummary: ProgressSummary = {
    totalQuizzes: 0,
    averageScore: '0.00',
    totalTimeSpent: 0,
    bestScore: 0,
    worstScore: 0,
    categoryStats: {},
    difficultyStats: {}
  };

  // Chart instance
  private chart?: Chart;
  private progressSubscription?: Subscription;

  constructor(public progressService: ProgressService) {}

  ngOnInit(): void {
    this.loadProgressData();

    // Subscribe to progress updates
    this.progressSubscription = this.progressService.progress$.subscribe(() => {
      this.loadProgressData();
      this.updateChart();
    });
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  private loadProgressData(): void {
    this.progressData = this.progressService.getAllProgress();
    this.progressSummary = this.progressService.getProgressSummary();
  }

  private initializeChart(): void {
    // Only initialize chart if there's progress data
    if (this.progressData.length === 0) {
      return;
    }

    switch (this.chartType) {
      case 'performance':
        this.initializePerformanceChart();
        break;
      case 'category':
        this.initializeCategoryChart();
        break;
      case 'difficulty':
        this.initializeDifficultyChart();
        break;
      case 'timeline':
        this.initializeTimelineChart();
        break;
    }
  }

  private initializePerformanceChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const recentProgress = this.progressService.getRecentProgress(10);
    const scores = recentProgress.map(p => (p.score / p.maxScore) * 100);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: recentProgress.map((_, index) => `Quiz ${index + 1}`),
          datasets: [{
            label: 'Score (%)',
            data: scores,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Recent Performance Trend'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }

  private initializeCategoryChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const categories = Object.keys(this.progressSummary.categoryStats);
    const averages = categories.map(cat => this.progressSummary.categoryStats[cat].average);
    const counts = categories.map(cat => this.progressSummary.categoryStats[cat].count);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Average Score (%)',
            data: averages,
            backgroundColor: [
              '#667eea',
              '#764ba2',
              '#f093fb',
              '#f5576c',
              '#4facfe',
              '#00f2fe',
              '#43e97b',
              '#38f9d7'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Performance by Category'
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context: any) {
                  const category = context.label;
                  const count = counts[context.dataIndex];
                  return `Quizzes: ${count}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }

  private initializeDifficultyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const difficulties = Object.keys(this.progressSummary.difficultyStats);
    const averages = difficulties.map(diff => this.progressSummary.difficultyStats[diff].average);
    const counts = difficulties.map(diff => this.progressSummary.difficultyStats[diff].count);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: difficulties,
          datasets: [{
            label: 'Average Score (%)',
            data: averages,
            backgroundColor: [
              '#28a745',
              '#ffc107',
              '#dc3545',
              '#6c757d'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Performance by Difficulty'
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context: any) {
                  const difficulty = context.label;
                  const count = counts[context.dataIndex];
                  return `Quizzes: ${count}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }

  private initializeTimelineChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) {
      return;
    }

    const sortedProgress = [...this.progressData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-20); // Last 20 quizzes

    const scores = sortedProgress.map(p => (p.score / p.maxScore) * 100);
    const dates = sortedProgress.map(p => new Date(p.date).toLocaleDateString());

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Score (%)',
            data: scores,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Score Timeline'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value: any) {
                  return value + '%';
                }
              }
            },
            x: {
              ticks: {
                maxTicksLimit: 10
              }
            }
          }
        }
      });
    }
  }

  private updateChart(): void {
    this.loadProgressData();
    this.initializeChart();
  }

  // Method to switch chart types programmatically
  switchChartType(type: 'performance' | 'category' | 'difficulty' | 'timeline'): void {
    this.chartType = type;
    this.initializeChart();
  }

  // Get chart container style
  getChartContainerStyle(): any {
    return {
      width: '100%',
      height: '400px',
      position: 'relative'
    };
  }
}
