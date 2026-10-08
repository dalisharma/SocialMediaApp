package org.smapp.socialmediaapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class SocialMediaAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                SocialMediaAppApplication.class,
                args
        );
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addResourceHandlers(
                    ResourceHandlerRegistry registry) {

                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations(
                                "file:uploads/"
                        );
            }
        };
    }
}