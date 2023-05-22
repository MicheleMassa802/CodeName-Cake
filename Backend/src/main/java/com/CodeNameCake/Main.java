package com.CodeNameCake;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Main {

    public static void main(String[] args) {
//        System.out.println("Hello Spring");
        SpringApplication.run(Main.class, args);  // SpringBoot app runner
    }

    // Get Method mapping to the index page of the url (http://localhost:8080/)
    @GetMapping("/")
    public String greet(){
        return "Hello";
    }
}
