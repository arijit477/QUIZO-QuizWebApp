import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private _http: HttpClient
  ) { }
//for admin
  public getQuestionsOfQuiz(qid:any){

    return this._http.get(`${baseUrl}/question/quiz/all/${qid}`)
  }

  //add question
  public addQuestion(question:any){
    return this._http.post(`${baseUrl}/question/`,question)
  }
  //Delete question
  public deleteQuestion(quesId:any){
    return this._http.delete(`${baseUrl}/question/${quesId}`)
  }

  //Update question
  public updateQuestion(question:any){
    return this._http.put(`${baseUrl}/question/`, question);
  }

  //Get question by id
  public getQuestion(quesId:any){
    return this._http.get(`${baseUrl}/question/${quesId}`);
  }
  //for User 
   public getQuestionsOfQuizForTest(qid:any){

    return this._http.get(`${baseUrl}/question/quiz/all/${qid}`)
  }

}
