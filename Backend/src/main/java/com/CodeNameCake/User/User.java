package com.CodeNameCake.User;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class User {

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
    private String username;
    private String email;
    private String password;

    public User() {}

    public User(Long userId, String username, String email, String password, Long shopId) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.shopId = shopId;
    }

    // Same constructor with no id for DB auto generate
    public User(String username, String email, String password, Long shopId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.shopId = shopId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

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
