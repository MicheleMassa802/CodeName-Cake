package com.CodeNameCake.User;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @SequenceGenerator(
            name="user_sequence",
            sequenceName="user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private Long userId;
    @Basic(optional = false)
    private Long shopId;
    @Column(unique = true)
    private String username;
    private String email;
    private String password;
    //////////////////////
    // Security Attribute
    @Enumerated(EnumType.ORDINAL)
    private Role role;

    public User() {}

    public User(Long userId, String username, String email, String password, Long shopId, Role role) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.shopId = shopId;
        this.role = role;
    }

    // Same constructor with no id for DB auto generate
    public User(String username, String email, String password, Long shopId, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.shopId = shopId;
        this.role = role;
    }


    //////////////////////
    // Security Code

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }



    //////////////////////
    // Boiler Plate Code

    public Long getUserId() {
        return userId;
    }

    // also overrides the Spring Security getUsername() method
    public String getUsername() {
        return username;
    }

    public String getEmail() { return email; }

    // also overrides the Spring Security getPassword() method
    public String getPassword() {
        return password;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", shopId=" + shopId +
                '}';
    }
}
