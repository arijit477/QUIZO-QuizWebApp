package com.project.quizo.contoller;

import com.project.quizo.config.JwtUtils;
import com.project.quizo.model.JwtRequest;
import com.project.quizo.model.JwtResponse;
import com.project.quizo.model.User;
import com.project.quizo.service.impl.UserDetailsServiceimpl;
import com.project.quizo.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class AuthenticateController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceimpl userDetailsServiceimpl;
    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private JwtUtils jwtUtils;

    //generate token

//    @PostMapping("/generate-token")
//    public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
//        try {
//
//            authenticate(jwtRequest.getUsername(), jwtRequest.getPassword());
//
//        } catch (UsernameNotFoundException e) {
//            e.printStackTrace();
//            throw new Exception("User not found");
//        }
//        /// /////authenticated
//        UserDetails userDetails =  this.userDetailsServiceimpl.loadUserByUsername(jwtRequest.getUsername());
//
//      String token =   this.jwtUtils.generateToken(userDetails.getUsername());
//
//      return ResponseEntity.ok(new JwtResponse(token));
//
//
//    }
//
@PostMapping("/generate-token")
public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
    try {
        authenticate(jwtRequest.getUsername(), jwtRequest.getPassword());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    final UserDetails userDetails = userDetailsServiceimpl.loadUserByUsername(jwtRequest.getUsername());
    System.out.println("User loaded: " + userDetails);
    // Extract roles from userDetails authorities
    List<String> roles = userDetails.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .collect(Collectors.toList());


    final String token = jwtUtils.generateToken(userDetails.getUsername(),roles);

    return ResponseEntity.ok(new JwtResponse(token));
}



    private void authenticate(String username , String password) throws Exception {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));

        }catch (DisabledException e){

            throw new Exception("USER DISABLED"+e.getMessage());
        }catch (BadCredentialsException e){
            throw new Exception("Invalid Credentials"+e.getMessage());
        }

    }
    //return the details of current user
    @GetMapping("/current-user")
    public User getCurrentUser() {
        return userService.getCurrentUser();
    }


}
