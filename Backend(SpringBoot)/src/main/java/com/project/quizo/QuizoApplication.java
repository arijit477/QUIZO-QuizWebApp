package com.project.quizo;

import com.project.quizo.model.Role;
import com.project.quizo.model.User;
import com.project.quizo.model.UserRole;
import com.project.quizo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class QuizoApplication implements CommandLineRunner {

	@Autowired
	private UserService userService;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	public static void main(String[] args) throws Exception {
		SpringApplication.run(QuizoApplication.class, args);


	}

	@Override
	public void run(String... args) throws Exception {

		String username = "arijit";

		// Check if user already exists
		if (userService.getUser(username) != null) {
			System.out.println("User '" + username + "' already exists, skipping creation.");
			return;
		}

		User user = new User();
		user.setFirstName("Arijit");
		user.setLastName("Mondal");
		user.setUsername(username);
		user.setPassword(this.bCryptPasswordEncoder.encode("arijit32"));

		Role role1 = new Role();
		role1.setRoleId(25L);
		role1.setRoleName("ROLE_ADMIN");

		Set<UserRole> userRoleSet = new HashSet<>();
		UserRole userRole = new UserRole();

		userRole.setRole(role1);
		userRole.setUser(user);

		userRoleSet.add(userRole);
		User user1 = this.userService.createUser(user,userRoleSet);
		System.out.println(user1.getUsername());
	}
}
