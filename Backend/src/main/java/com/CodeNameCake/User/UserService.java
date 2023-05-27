package com.CodeNameCake.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

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


    /////////////////
    // POST METHOD //
    /////////////////
    public void addUser(User user){
        // NOTE: shop creation request must be sent first to create the shop and then make sure
        // we catch the shopId so that it's automatically sent with this request

        Optional<User> userOptional = userRepository.findUserByEmail(user.getEmail());

        if (userOptional.isPresent()) {
            // throw exception
            throw new IllegalStateException("Email Taken");
        } else {
            // save student
            userRepository.save(user);
        }
    }
}
