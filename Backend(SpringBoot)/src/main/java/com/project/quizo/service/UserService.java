package com.project.quizo.service;

import com.project.quizo.model.User;
import com.project.quizo.model.UserRole;

import java.util.Set;

public interface UserService {
    //creating user
    public User createUser(User user, Set<UserRole> userRoles) throws Exception;

    //Get user by username
    public User getUser(String username);
   //deleting user by id
    public void deleteUser(Long userId);


}

