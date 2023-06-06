package com.CodeNameCake.config;

import jakarta.servlet.Filter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
// @RequiredArgsConstructor : Lombok for making a constructor with the declared final attributes
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    @SuppressWarnings("removal")  // for the stupid fucking deprecation warnings, why can't you be like Django Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.csrf()
                .disable()
                .authorizeHttpRequests()
                .requestMatchers(
                        "/api/dev/auth/**", // whitelisted to allow for user creation and auth
                        "/api/dev/shop/addShop"  // whitelisted to allow for shop creation before user creation
                )
                // this is the whitelist for endpoints that don't need authentication, like all the auth methods
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}