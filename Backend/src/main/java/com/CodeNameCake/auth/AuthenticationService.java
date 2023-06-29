package com.CodeNameCake.auth;

import com.CodeNameCake.Shop.Shop;
import com.CodeNameCake.Shop.ShopRepository;
import com.CodeNameCake.User.Role;
import com.CodeNameCake.User.User;
import com.CodeNameCake.User.UserRepository;
import com.CodeNameCake.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public AuthenticationResponse register(RegisterRequest request) {
        // build the user out of the request

        // NOTE: shop creation request must be sent first to create the shop and then make sure
        // we catch the shopId so that it's automatically sent with this request

        Optional<User> userUsernameOptional = userRepository.findUserByUsername((request.getUsername()));
        Optional<User> userEmailOptional = userRepository.findUserByEmail(request.getEmail());

        User newUser;

        if (userUsernameOptional.isPresent()) {
            // throw exception
            throw new IllegalStateException("Username Taken");
        } else if (userEmailOptional.isPresent()) {
            // throw exception
            throw new IllegalStateException("Email Taken");
        } else {
            // create user object while encoding the password and save it
            newUser = new User(request.getUsername(), request.getEmail(),
                   passwordEncoder.encode(request.getPassword()), request.getShopId(), Role.USER);
            // save this user
            userRepository.save(newUser);
        }

        // shop should already be created by the time a user it to be created
        Optional<Shop> shopOptional = shopRepository.findById(newUser.getShopId());
        Shop newShop;

        if (shopOptional.isPresent()) {
            newShop = shopOptional.get();
        } else {
            // throw exception
            throw new IllegalStateException("Corresponding shop not found");
        }

        var jwtToken = jwtService.generateToken(newUser);
        return AuthenticationResponse.builder().userId(newUser.getUserId()).shopId((newUser.getShopId()))
                .shopName(newShop.getShopName()).colorway(newShop.getColorwaySelection()).token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // only email OR username sent to log in
        boolean usernamePresent = !request.getUsername().equals(""); // && request.getUserId() == 0;
        boolean emailPresent = !request.getEmail().equals(""); // && request.getUserId() == 0;
        boolean userIdPresent = request.getUserId() != 0; //request.getEmail().equals("") && request.getUsername().equals("");

        String accountUsername;

        // authenticator ultimately works with username so transform the email given into a username if email
        // was chosen as the authentication mechanism
        if (usernamePresent) {

            accountUsername = request.getUsername();

        } else if (emailPresent) {

            Optional<User> userWithEmail = userRepository.findUserByEmail(request.getEmail());

            if (userWithEmail.isPresent()) {
                accountUsername = userWithEmail.get().getUsername();
            } else {
                throw new IllegalStateException("Account not found");
            }
        } else if (userIdPresent) {

            Optional<User> userWithId = userRepository.findById(request.getUserId());

            if (userWithId.isPresent()) {
                accountUsername = userWithId.get().getUsername();
            } else {
                throw new IllegalStateException("Account not found");
            }
        } else {
            throw new IllegalStateException("Account details not provided");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        accountUsername,
                        request.getPassword()
                )
        );

        User user = userRepository.findUserByUsername(accountUsername)
                .orElseThrow(() -> new IllegalStateException("Account not found"));
        // neither of these exceptions should occur after verification, but it's just a formality

        Shop shop = shopRepository.findById(user.getShopId())
                .orElseThrow(() -> new IllegalStateException("Corresponding shop not found"));

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().userId(user.getUserId()).shopId((user.getShopId()))
                .shopName(shop.getShopName()).colorway(shop.getColorwaySelection()).token(jwtToken).build();

    }

    public AuthenticationResponse updateUser(UserUpdateRequest request, Long userId) {
        // find user to update
        Optional<User> userOptional = userRepository.findById(userId);

        User userToUpdate;

        if (userOptional.isPresent()){
            // update accordingly
            userToUpdate = userOptional.get();
            userToUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
            userToUpdate.setShopId(request.getShopId());

            // check possible update email doesn't already exist
            if (!userToUpdate.getEmail().equals(request.getEmail())) {
                // check the update email and let the update go through if valid
                Optional<User> userByEmail = userRepository.findUserByEmail(request.getEmail());

                if (userByEmail.isPresent()) {
                    // throw exception (stop update from going through)
                    throw new IllegalStateException("Email Taken");
                } else {
                    // let email update go through
                    userToUpdate.setEmail(request.getEmail());
                }
            }

            // check possible update username doesn't already exist
            if (!userToUpdate.getUsername().equals(request.getUsername())) {
                // check the updated username and let the update go through if valid
                Optional<User> userByUsername = userRepository.findUserByUsername(request.getUsername());

                if (userByUsername.isPresent()) {
                    // throw exception (stop update from going through)
                    throw new IllegalStateException("Username Taken");
                } else {
                    // let username update go through
                    userToUpdate.setUsername(request.getUsername());
                }

            }

            // save the updated user
            userRepository.save(userToUpdate);

        } else {
            // user to update not found
            throw new IllegalStateException("User with ID " + userId + " does not exist");
        }

        // considering an update to your account information can change critical fields such as email/username/password
        // I return a new token based on it too for it to behave as a re-registration
        var jwtToken = jwtService.generateToken(userToUpdate);  // at this point it's the updated user
        return AuthenticationResponse.builder().token(jwtToken).userId(userToUpdate.getUserId()).build();
    }
}
