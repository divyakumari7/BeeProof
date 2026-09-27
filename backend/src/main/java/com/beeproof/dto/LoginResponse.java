package com.beeproof.dto;

public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;

    public LoginResponse() {}

    public LoginResponse(String token, String type, UserDto user) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.user = user;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String type = "Bearer";
        private UserDto user;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder type(String type) { this.type = type; return this; }
        public LoginResponseBuilder user(UserDto user) { this.user = user; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, type, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
