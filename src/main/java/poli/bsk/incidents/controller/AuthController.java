package poli.bsk.incidents.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import poli.bsk.incidents.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public AuthController(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Map<String, Object> response = new HashMap<>();
            response.put("email", jwtTokenUtil.extractEmail(jwt));
            response.put("name", jwtTokenUtil.extractName(jwt));
            response.put("roles", jwtTokenUtil.extractRoles(jwt));
            response.put("sub", jwt.getClaimAsString("sub"));
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("name", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> response = new HashMap<>();

        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            response.put("email", jwtTokenUtil.extractEmail(jwt));
            response.put("name", jwtTokenUtil.extractName(jwt));
            response.put("roles", jwtTokenUtil.extractRoles(jwt));
            response.put("authenticated", true);
        } else {
            response.put("principal", authentication.getName());
            response.put("authenticated", authentication.isAuthenticated());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();
        response.setHeader("Set-Cookie", "JSESSIONID=; Path=/; Max-Age=0");

        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", "Logged out successfully");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/providers")
    public ResponseEntity<Map<String, String>> getAvailableProviders() {
        Map<String, String> providers = new HashMap<>();
        providers.put("microsoft", "/login");
        return ResponseEntity.ok(providers);
    }
}
