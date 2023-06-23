package com.CodeNameCake.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private Long userId;
    private Long shopId;
    private String shopName;
    private Integer colorway;
    private String token;


}
