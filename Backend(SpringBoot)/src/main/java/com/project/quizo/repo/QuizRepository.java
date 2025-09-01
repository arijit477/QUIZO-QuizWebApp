package com.project.quizo.repo;

import com.project.quizo.model.exam.Category;
import com.project.quizo.model.exam.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz , Long> {

    public List<Quiz> findBycategory(Category category);

    //Active api for user

    public List<Quiz> findByActive(boolean b);

    public List<Quiz> findByCategoryAndActive(Category c , boolean b);
}
