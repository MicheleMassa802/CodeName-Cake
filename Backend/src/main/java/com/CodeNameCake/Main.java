package com.CodeNameCake;

import com.CodeNameCake.User.User;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
//        System.out.println("Hello Spring");
        SpringApplication.run(Main.class, args);  // SpringBoot app runner
    }
}
