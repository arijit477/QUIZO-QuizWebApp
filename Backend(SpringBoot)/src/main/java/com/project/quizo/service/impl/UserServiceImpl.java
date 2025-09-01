package com.project.quizo.service.impl;

import com.project.quizo.model.User;
import com.project.quizo.model.UserRole;
import com.project.quizo.repo.RoleRepository;
import com.project.quizo.repo.UserRepository;
import com.project.quizo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Set;
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
//creating user
    @Override
    public User createUser(User user, Set<UserRole> userRoles) throws Exception {

        User local = this.userRepository.findByUsername(user.getUsername());

        if (local!=null){
            System.out.println("User already exist");
            throw new Exception("user already exists!!");
        }else {

            //user create
            for (UserRole ur:userRoles){
                roleRepository.save(ur.getRole());
                ur.setUser(user);
            }
            user.getUserRoles().addAll(userRoles);
            local = this.userRepository.save(user);
        }

        return local;
    }


//getting user by username
    @Override
    public User getUser(String username) {
        return this.userRepository.findByUsername(username) ;
    }

    @Override
    public void deleteUser(Long userId) {
        this.userRepository.deleteById(userId);
    }


    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        return userRepository.findByUsername(username);
    }

}
