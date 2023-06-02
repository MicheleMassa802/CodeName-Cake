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

        Optional<User> userUsernameOptional = userRepository.findUserByUsername((user.getUsername()));
        Optional<User> userEmailOptional = userRepository.findUserByEmail(user.getEmail());

        if (userUsernameOptional.isPresent()) {
            // throw exception
            throw new IllegalStateException("Username Taken");
        } else if (userEmailOptional.isPresent()) {
            // throw exception
            throw new IllegalStateException("Email Taken");
        } else {
            // save user
            userRepository.save(user);
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


    ////////////////
    // PUT METHOD //
    ////////////////
    public void updateUser(Long userId, User userUpdated){
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()){
            // update accordingly
            User actualUser = userOptional.get();
            actualUser.setUsername(userUpdated.getUsername());
            actualUser.setPassword(userUpdated.getPassword());
            actualUser.setShopId(userUpdated.getShopId());

            // check possible update email doesn't already exist
            if (!actualUser.getEmail().equals(userUpdated.getEmail())) {
                // check the update email and let the update go through if valid
                Optional<User> userByEmail = userRepository.findUserByEmail(userUpdated.getEmail());

                if (userByEmail.isPresent()) {
                    // throw exception (stop update from going through)
                    throw new IllegalStateException("Email Taken");
                } else {
                    // let email update go through
                    actualUser.setEmail(userUpdated.getEmail());
                }
            } else if (!actualUser.getUsername().equals(userUpdated.getUsername())) {
                // check the updated username and let the update go through if valid
                Optional<User> userByUsername = userRepository.findUserByUsername(userUpdated.getUsername());

                if (userByUsername.isPresent()) {
                    // throw exception (stop update from going through)
                    throw new IllegalStateException("Username Taken");
                } else {
                    // let username update go through
                    actualUser.setUsername(userUpdated.getUsername());
                }

            }

            // finish off with the saving of the user
            userRepository.save(actualUser);

        } else {
            // no user found under that id
            throw new IllegalStateException("User with ID " + userId + " does not exist");
        }
    }


}
