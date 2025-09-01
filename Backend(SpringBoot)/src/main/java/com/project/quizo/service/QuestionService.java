package com.project.quizo.service;

import com.project.quizo.model.exam.Question;
import com.project.quizo.model.exam.Quiz;

import java.util.Set;

public interface QuestionService {

    public Question addQuestion(Question question);
    public Question updateQuestion(Question question);
    public Set<Question> getQuestions();
    public Question getQuestion(Long quesId);
    public void deleteQuestion(Long quesId);

    public Set<Question> getQuestionsOfQuiz(Quiz quiz);
}
