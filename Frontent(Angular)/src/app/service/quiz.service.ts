import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  public getQuizzes(){
    return this.http.get(`${baseUrl}/quiz/`);
  } 
   public addQuiz(quiz:any){
   return this.http.post(`${baseUrl}/quiz/`,quiz);
  }
  //delete quiz
public deleteQuiz(id:any){
  return this.http.delete(`${baseUrl}/quiz/${id}`);
}
//get single quiz
public getQuiz(id:any){
  return this.http.get(`${baseUrl}/quiz/${id}`);
}
//Update quiz
public updateQuiz(quiz:any){
  return this.http.put(`${baseUrl}/quiz/`,quiz);
}

//get quizes of category
public getQuizzesOfCategory(categoryId:any){
  return this.http.get(`${baseUrl}/quiz/category/${categoryId}`);
}

//get active quizzes
public getActiveQuizzes(){
  return this.http.get(`${baseUrl}/quiz/active`);
}

//get Active Quizzes of Category

public getActiveQuizzesOfCategory(categoryId:any){
  return this.http.get(`${baseUrl}/quiz/category/active/${categoryId}`);
}

}
