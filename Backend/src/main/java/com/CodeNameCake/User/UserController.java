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

    @GetMapping
    public List<User> getUsers(){
        return userService.getUsers();
    }


    @DeleteMapping(path = "/{userId}")
    public void deleteUser(@PathVariable("userId") Long userId){
        userService.deleteUser(userId);
    }

//    Absorbed by Auth class

//    @PostMapping
//    public void addUser(@RequestBody User user){
//        userService.addUser(user);
//
//    }

//    @PutMapping(path = "/{userId}")
//    public void updateUser(@PathVariable("userId") Long userId, @RequestBody User userUpdated) {
//        userService.updateUser(userId, userUpdated);
//    }


}
