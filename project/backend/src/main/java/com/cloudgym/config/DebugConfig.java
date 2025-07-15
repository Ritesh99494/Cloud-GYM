package com.cloudgym.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class DebugConfig {

    private static final Logger logger = LoggerFactory.getLogger(DebugConfig.class);

    @Bean
    public CommandLineRunner debugRunner(Environment env) {
        return args -> {
            logger.info("=== CLOUD GYM APPLICATION DEBUG INFO ===");
            logger.info("Active profiles: {}", String.join(", ", env.getActiveProfiles()));
            logger.info("Database URL: {}", env.getProperty("spring.datasource.url"));
            logger.info("JPA DDL Auto: {}", env.getProperty("spring.jpa.hibernate.ddl-auto"));
            logger.info("Show SQL: {}", env.getProperty("spring.jpa.show-sql"));
            logger.info("JWT Secret length: {}", env.getProperty("spring.security.jwt.secret", "").length());
            logger.info("CORS Origins: {}", env.getProperty("cors.allowed-origins"));
            logger.info("Server Port: {}", env.getProperty("server.port"));
            logger.info("Context Path: {}", env.getProperty("server.servlet.context-path"));
            logger.info("=== DEBUG INFO END ===");
        };
    }
}