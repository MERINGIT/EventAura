package com.eventaura.backend.service;

import com.eventaura.backend.entity.User;
import com.eventaura.backend.repository.UserRepository;
import com.eventaura.backend.request.LoginRequest;
import com.eventaura.backend.request.SignupRequest;
import com.eventaura.backend.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse signup(SignupRequest signupRequest){
        var user = User.builder()
                .firstname(signupRequest.getFirstname())
                .lastname(signupRequest.getLastname())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .phone(signupRequest.getPhone())
                .role(signupRequest.getRole())
                .status("active")
                .imageurl("")
                .build();
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .build();

    }

    public AuthenticationResponse login(LoginRequest loginRequest){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword()
        ));

        var user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User email not found to be authenticated"));

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public String getUserEmailByToken(String token) {
        String email = jwtService.extractUserEmail(token);
        if(email!= null && !jwtService.isTokenExpired(token)){
            return email;
        }else {
            throw new RuntimeException("Invalid token");
        }
    }

    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
