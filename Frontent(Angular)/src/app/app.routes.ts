import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { RegisterComponent } from './Pages/register/register.component';
import { LoginComponent } from './Pages/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './Pages/home/home.component';
import { AdminDashboardComponent } from './Pages/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './Pages/user/user-dashboard/user-dashboard.component';
import { AdminGuard } from './service/admin.guard';
import { NormalGuard } from './service/normal.guard';
import { ProfileComponent } from './Pages/profile/profile.component';
import { UserProfileComponent } from './Pages/user/user-profile/user-profile.component';
import { WelcomeComponent } from './Pages/admin/welcome/welcome.component';
import { ViewCategoryComponent } from './Pages/admin/view-category/view-category.component';
import { AddCategoryComponent } from './Pages/admin/add-category/add-category.component';
import { ViewQuizzesComponent } from './Pages/admin/view-quizzes/view-quizzes.component';
import { AddQuizComponent } from './Pages/admin/add-quiz/add-quiz.component';
import { UpdateQuizComponent } from './Pages/admin/update-quiz/update-quiz.component';
import { ViewQuizQuestionsComponent } from './Pages/admin/view-quiz-questions/view-quiz-questions.component';
import { AddQuestionComponent } from './Pages/admin/add-question/add-question.component';
import { LoadQuizComponent } from './Pages/user/load-quiz/load-quiz.component';
import { InstructionComponent } from './Pages/user/instruction/instruction.component';
import { StartComponent } from './Pages/user/start/start.component';
import { QuizAttemptComponent } from './Pages/quiz-attempt/quiz-attempt.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, canActivate: [NormalGuard] },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'categories', component: ViewCategoryComponent },
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'view-quizzes', component: ViewQuizzesComponent },
      { path: 'add-quiz', component: AddQuizComponent },
      { path: 'quiz/:qid', component: UpdateQuizComponent },
      {
        path: 'view-questions/:qid/:title',
        component: ViewQuizQuestionsComponent,
      },
      { path: 'add-question/:qid/:title', component: AddQuestionComponent },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [NormalGuard],
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: ':catId', component: LoadQuizComponent },
      { path: 'instruction/:qid', component: InstructionComponent },
    ],
  },

  {
    path: 'start/:qid',
    component: StartComponent,
    canActivate: [NormalGuard],

  }
];
