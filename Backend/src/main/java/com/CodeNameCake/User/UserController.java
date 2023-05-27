package com.CodeNameCake.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/dev/user")
public class UserController {

    private final UserService userService;


    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get Method mapping to the index page of the url (http://localhost:8080/)
    @GetMapping
    public List<User> getUsers(){
        return userService.getUsers();
    }


    @PostMapping
    public void addUser(@RequestBody User user){
        userService.addUser(user);

    }


}
