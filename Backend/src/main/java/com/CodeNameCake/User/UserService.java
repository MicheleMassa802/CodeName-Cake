package com.CodeNameCake.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    ////////////////
    // GET METHOD //
    ////////////////
    public List<User> getUsers(){
        return userRepository.findAll();

    }

    public User getUser(Long userId) {
        Optional<User> user =  userRepository.findById(userId);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new IllegalStateException("User with ID " + userId + " does not exist");
        }
    }


    ///////////////////
    // DELETE METHOD //
    ///////////////////
    public void deleteUser(Long userId){
        boolean valid = userRepository.existsById(userId);

        if (valid) {
            userRepository.deleteById(userId);
        } else {
            throw new IllegalStateException("User with ID " + userId + " does not exist");
        }
    }


    // POST & PUT Absorbed by Auth class

}
