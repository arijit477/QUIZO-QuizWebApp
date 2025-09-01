import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { StorageUtil } from '../utils/storage.util';

@Injectable({
  providedIn: 'root'
})
export class PersistentTimerService {
  private readonly STORAGE_KEY = 'quiz_timer_data';
  private timerSubject = new BehaviorSubject<number>(0);
  private startTime: number = 0;
  private duration: number = 0;
  private timerInterval: any;

  constructor() {
    this.loadTimerState();
  }

  /**
   * Start the timer with specified duration in seconds
   */
  startTimer(duration: number): void {
    this.duration = duration;
    this.startTime = Date.now();
    
    const timerData = {
      startTime: this.startTime,
      duration: this.duration,
      quizId: this.getCurrentQuizId()
    };
    
    StorageUtil.setItem(this.STORAGE_KEY, JSON.stringify(timerData));
    this.startCountdown();
  }

  /**
   * Get remaining time in seconds
   */
  getRemainingTime(): number {
    if (!this.startTime || !this.duration) return 0;
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    return Math.max(0, this.duration - elapsed);
  }

  /**
   * Get observable for timer updates
   */
  getTimerObservable(): Observable<number> {
    return this.timerSubject.asObservable();
  }

  /**
   * Check if timer is active
   */
  isTimerActive(): boolean {
    const data = StorageUtil.getItem(this.STORAGE_KEY);
    if (!data) return false;
    
    const timerData = JSON.parse(data);
    const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000);
    return elapsed < timerData.duration;
  }

  /**
   * Clear timer data
   */
  clearTimer(): void {
    StorageUtil.removeItem(this.STORAGE_KEY);
    this.startTime = 0;
    this.duration = 0;
    this.timerSubject.next(0);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  /**
   * Get formatted time string
   */
  getFormattedTime(seconds: number): string {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    
    const hhStr = hh.toString().padStart(2, '0');
    const mmStr = mm.toString().padStart(2, '0');
    const ssStr = ss.toString().padStart(2, '0');
    
    return `${hhStr}:${mmStr}:${ssStr}`;
  }

  private loadTimerState(): void {
    const data = StorageUtil.getItem(this.STORAGE_KEY);
    if (data) {
      const timerData = JSON.parse(data);
      this.startTime = timerData.startTime;
      this.duration = timerData.duration;
      
      if (this.getRemainingTime() > 0) {
        this.startCountdown();
      } else {
        this.clearTimer();
      }
    }
  }

  private startCountdown(): void {
    this.timerInterval = interval(1000).pipe(
      map(() => this.getRemainingTime()),
      takeWhile(remaining => remaining >= 0)
    ).subscribe(remaining => {
      this.timerSubject.next(remaining);
      
      if (remaining <= 0) {
        this.onTimerExpired();
      }
    });
  }

  private onTimerExpired(): void {
    this.clearTimer();
    // Timer expired event will be handled by components
  }

  private getCurrentQuizId(): string {
    // This will be set by the component using the service
    return window.location.pathname.split('/').pop() || 'default';
  }
}
