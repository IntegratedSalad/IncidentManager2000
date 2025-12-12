package poli.bsk.incidents.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Check if user is authenticated and is an OAuth2 user (not anonymous)
        if (authentication == null || !authentication.isAuthenticated() || 
            !(authentication.getPrincipal() instanceof OAuth2User)) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> response = new HashMap<>();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        response.put("name", oauth2User.getAttribute("name"));
        response.put("email", oauth2User.getAttribute("email"));
        response.put("provider", authentication.getName());
        response.put("attributes", oauth2User.getAttributes());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/success")
    public ResponseEntity<Map<String, Object>> loginSuccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            response.put("user", oauth2User.getAttributes());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getLoginPage() {
        Map<String, String> response = new HashMap<>();
        response.put("keycloak_url", "/oauth2/authorization/keycloak");
        response.put("microsoft_url", "/oauth2/authorization/microsoft");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        // Get the current session and invalidate it
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear Spring Security context
        SecurityContextHolder.clearContext();
        
        // Clear authentication cookies
        response.setHeader("Set-Cookie", "JSESSIONID=; Path=/; Max-Age=0");
        
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", "Logged out successfully");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/providers")
    public ResponseEntity<Map<String, String>> getAvailableProviders() {
        Map<String, String> providers = new HashMap<>();
        providers.put("keycloak", "/oauth2/authorization/keycloak");
        providers.put("microsoft", "/oauth2/authorization/microsoft");
        return ResponseEntity.ok(providers);
    }
}
