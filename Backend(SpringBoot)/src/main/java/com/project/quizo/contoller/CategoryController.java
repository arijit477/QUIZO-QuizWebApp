package com.project.quizo.contoller;

import com.project.quizo.model.exam.Category;
import com.project.quizo.service.impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryServiceImpl categoryService;

    //add category
    @PostMapping("/")
    public ResponseEntity<Category> addCategory(@RequestBody Category category){
        Category category1 = this.categoryService.addCategory(category);
    return ResponseEntity.ok(category1);
    }

    //get category
    @GetMapping("/{categoryId}")
public Category getCategory(@PathVariable Long categoryId){
        return this.categoryService.getCategory(categoryId);
    }

    //get all categories

    @GetMapping("/")
    public ResponseEntity<?> getCategories(){
        return  ResponseEntity.ok(this.categoryService.getCategories());
    }

    //Update
    @PutMapping("/")
    public Category updateCategory(@RequestBody Category category){
       return this.categoryService.updateCategory(category);
    }
//delete category
    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId){
        this.categoryService.deleteCategory(categoryId);
    }


}
