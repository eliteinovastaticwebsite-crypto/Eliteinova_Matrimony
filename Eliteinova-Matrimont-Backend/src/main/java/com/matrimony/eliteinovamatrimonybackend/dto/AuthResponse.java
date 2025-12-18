package com.matrimony.eliteinovamatrimonybackend.dto;

public class AuthResponse {
    private String token;
    private String message;
    private UserResponse user;
    private Boolean isAdmin;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String message, UserResponse user, Boolean isAdmin) {
        this.token = token;
        this.message = message;
        this.user = user;
        this.isAdmin = isAdmin;
    }

    // Getters and Setters - Fixed naming consistency
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }

    // Consistent naming - use isAdmin instead of getIsAdmin
    public Boolean getAdmin() { return isAdmin; }
    public void setAdmin(Boolean admin) { isAdmin = admin; }
}