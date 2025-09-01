package com.project.quizo.contoller;

import com.project.quizo.model.Role;
import com.project.quizo.model.User;
import com.project.quizo.model.UserRole;
import com.project.quizo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
   private UserService userService ;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/")
    public User createUser(@RequestBody User user) throws Exception {

        user.setPassword(this.bCryptPasswordEncoder.encode(user.getPassword()));
        Set<UserRole> roles =new HashSet<>();
        Role role = new Role();
        role.setRoleId(15L);
        role.setRoleName("ROLE_NORMAL");
        roles.add(new UserRole(role));

        return this.userService.createUser(user,roles);


    }

    @GetMapping("/{username}")
    public User getUser(@PathVariable("username") String username){
        return this.userService.getUser(username);
    }

    //delete user by id

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Long userId){

        this.userService.deleteUser(userId);
    }

}
