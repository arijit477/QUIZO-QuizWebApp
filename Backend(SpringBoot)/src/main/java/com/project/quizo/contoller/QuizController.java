package com.project.quizo.contoller;

import com.project.quizo.model.exam.Category;
import com.project.quizo.model.exam.Quiz;
import com.project.quizo.service.impl.QuizServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/quiz")
public class QuizController {
    @Autowired
    private QuizServiceImpl quizService;

    //add quiz
    @PostMapping("/")
    public ResponseEntity<Quiz> addQuiz(@RequestBody Quiz quiz){
        return ResponseEntity.ok(this.quizService.addQuiz(quiz));
    }
    //update quiz
    @PutMapping("/")
    public ResponseEntity<Quiz> updateQuiz(@RequestBody Quiz quiz){
        return ResponseEntity.ok(this.quizService.updateQuiz(quiz));
    }

    //getQuizzes

    @GetMapping("/")
    public  ResponseEntity<?> getQuizzes()
    {
        return ResponseEntity.ok(this.quizService.getQuizzes());
    }

    //get individual quiz by id
    @GetMapping("{qId}")
    public ResponseEntity<?> getQuiz(@PathVariable Long qId){
        return ResponseEntity.ok(this.quizService.getQuiz(qId));
    }

    //delete Quiz
    @DeleteMapping("/{qId}")
    public void deleteQuiz(@PathVariable Long qId){
         this.quizService.deleteQuiz(qId);
    }

    //Get Quiz of Category

    @GetMapping("/category/{cid}")
    public List<Quiz> getQuizzesOfCategory(@PathVariable Long cid){
        Category category = new Category();
        category.setCid(cid);

        return this.quizService.getQuizzesOfCategory(category);
    }

    //get active quizzes
    @GetMapping("/active")
    public List<Quiz> getActiveQuizzes(){
        return this.quizService.getActiveQuizzes();
    }

    //get active quizzes of category

    @GetMapping("/category/active/{cid}")
    public List<Quiz> getActiveQuizzesOfCategory(@PathVariable Long cid){
        Category category = new Category();
        category.setCid(cid);
        return this.quizService.getActiveQuizzesOfCategory(category);

    }

}
