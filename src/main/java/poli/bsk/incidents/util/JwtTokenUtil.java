package poli.bsk.incidents.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class JwtTokenUtil {

    public Set<String> extractRoles(Jwt jwt) {
        Set<String> roles = new HashSet<>();

        if (jwt.hasClaim("roles")) {
            try {
                List<String> jwtRoles = jwt.getClaimAsStringList("roles");
                if (jwtRoles != null) {
                    roles.addAll(jwtRoles);
                }
            } catch (Exception e) {
            }
        }

        if (jwt.hasClaim("scp")) {
            try {
                String scope = jwt.getClaimAsString("scp");
                if (scope != null) {
                    String[] scopes = scope.split(" ");
                    for (String s : scopes) {
                        if (!s.isEmpty()) {
                            roles.add("ROLE_" + s.toUpperCase());
                        }
                    }
                }
            } catch (Exception e) {
            }
        }

        if (roles.isEmpty()) {
            roles.add("ROLE_USER");
        }

        return roles;
    }

    public String extractEmail(Jwt jwt) {
        if (jwt.hasClaim("email")) {
            return jwt.getClaimAsString("email");
        }
        if (jwt.hasClaim("preferred_username")) {
            return jwt.getClaimAsString("preferred_username");
        }
        return jwt.getClaimAsString("sub");
    }

    public String extractName(Jwt jwt) {
        if (jwt.hasClaim("name")) {
            return jwt.getClaimAsString("name");
        }
        if (jwt.hasClaim("given_name")) {
            String givenName = jwt.getClaimAsString("given_name");
            String familyName = jwt.hasClaim("family_name") ? jwt.getClaimAsString("family_name") : "";
            return (givenName + " " + familyName).trim();
        }
        return jwt.getClaimAsString("preferred_username");
    }

    public boolean hasRole(Authentication authentication, String role) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role.toUpperCase()));
    }

    public String getPrincipal(Jwt jwt) {
        return extractEmail(jwt);
    }
}
