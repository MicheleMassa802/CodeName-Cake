package com.CodeNameCake.auth;

import com.CodeNameCake.User.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dev/auth")
@RequiredArgsConstructor // Lombok for making a constructor with the declared final attributes
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PutMapping(path = "/update/{userId}")
    public ResponseEntity<AuthenticationResponse> updateUser(@PathVariable("userId") Long userId,
                                                             @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(authenticationService.updateUser(request, userId));
    }

}
