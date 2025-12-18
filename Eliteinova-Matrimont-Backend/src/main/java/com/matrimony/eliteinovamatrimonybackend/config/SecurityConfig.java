// src/main/java/com/matrimony/elitenxtmatrimonybackend/config/SecurityConfig.java
package com.matrimony.eliteinovamatrimonybackend.config;

import com.matrimony.eliteinovamatrimonybackend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        // Allow root and health endpoints for local testing
                        .requestMatchers("/", "/actuator/**").permitAll()

                        // ✅ ADD THIS LINE - Allow admin login without authentication
                        .requestMatchers("/api/admin/auth/login").permitAll()
                        .requestMatchers("/api/admin/auth/check").permitAll()
                        .requestMatchers("/api/admin/auth/logout").permitAll()

                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/plans/**").permitAll()

                        // Public viewing for images/documents
                        .requestMatchers(
                                "/api/files/images/**",
                                "/api/files/public/images/**",
                                "/api/files/documents/**"
                        ).permitAll()

                        // Protected operations
                        .requestMatchers(
                                "/api/files/upload-*",
                                "/api/files/secure-images/**",
                                "/api/files/my-documents",
                                "/api/files/profile-photos",
                                "/api/files/profile-photo/**"
                        ).authenticated()

                        .requestMatchers("/api/profiles/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Other admin endpoints need ADMIN role
                        .requestMatchers("/api/interests/**").authenticated()

                        // Default
                        .anyRequest().permitAll()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}