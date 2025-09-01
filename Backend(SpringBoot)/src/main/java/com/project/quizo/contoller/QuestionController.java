package com.project.quizo.contoller;

import com.project.quizo.model.exam.Question;
import com.project.quizo.model.exam.Quiz;
import com.project.quizo.service.impl.QuestionServiceImpl;
import com.project.quizo.service.impl.QuizServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/question")
public class QuestionController {

    @Autowired
    private QuestionServiceImpl questionService;

    @Autowired
    private QuizServiceImpl quizService;

    //add question
    @PostMapping("/")
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(this.questionService.addQuestion(question));
    }

    //update
    @PutMapping("/")
    public ResponseEntity<Question> updateQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(this.questionService.updateQuestion(question));
    }

    //get all question of any quiz for user
    @GetMapping("/quiz/{qId}")
    public ResponseEntity<?> getQuestionOfQuiz(@PathVariable Long qId) {
//        Quiz quiz = new Quiz();
//        quiz.setQid(qId);
//        Set<Question> questionsOfQuiz =this.questionService.getQuestionsOfQuiz(quiz);
//    return ResponseEntity.ok(questionsOfQuiz);
        Quiz quiz = this.quizService.getQuiz(qId);
        Set<Question> questions = quiz.getQuestions();

        List<Question> list = new ArrayList<>(questions);

        if (list.size() > Integer.parseInt(quiz.getNumberOfQuestions())) {
            list = list.subList(0, Integer.parseInt(quiz.getNumberOfQuestions() + 1));
        }
        Collections.shuffle(list);
        return ResponseEntity.ok(list);
    }

    //get all question of all quiz for admin
    @GetMapping("/quiz/all/{qId}")
    public ResponseEntity<?> getQuestionOfQuizAdmin(@PathVariable Long qId) {
        Quiz quiz = new Quiz();
        quiz.setQid(qId);
        Set<Question> questionsOfQuiz = this.questionService.getQuestionsOfQuiz(quiz);
        return ResponseEntity.ok(questionsOfQuiz);

    }

    //get single question
    @GetMapping("/{quesId}")
    public ResponseEntity<?> getQuestion(@PathVariable Long quesId) {
        return ResponseEntity.ok(this.questionService.getQuestion(quesId));
    }

    //get questions
    @GetMapping("/")
    public ResponseEntity<?> getQuestions() {
        return ResponseEntity.ok(this.questionService.getQuestions());
    }


    //delete
    @DeleteMapping("/{quesId}")
    public void deleteQuestion(@PathVariable Long quesId) {
        this.questionService.deleteQuestion(quesId);
    }
}
