package com.CodeNameCake.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    // what needs to be passed to create a user
    private Long shopId;
    private String username;
    private String email;
    private String password;
}
