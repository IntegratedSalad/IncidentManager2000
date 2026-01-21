package poli.bsk.incidents.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import poli.bsk.incidents.util.JwtTokenUtil;
import poli.bsk.incidents.repository.UserRepository;
import poli.bsk.incidents.model.User;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Converter JWT na Authentication z rolami
 * Pobiera role z bazy danych zamiast z JWT, aby wspierać dynamiczne przypisywanie ról
 */
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationConverter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Pobierz email użytkownika z JWT
        String email = jwtTokenUtil.extractEmail(jwt);
        
        // Pobierz role z bazy danych zamiast z JWT
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        
        // Spróbuj znaleźć użytkownika w bazie
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String role = user.getRole();
            
            // Konwertuj rolę z bazy na GrantedAuthority z prefixem "ROLE_"
            if (role != null && !role.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
                System.out.println("[JwtAuthenticationConverter] ✓ User " + email + " has role: " + role);
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                System.out.println("[JwtAuthenticationConverter] ⚠ User " + email + " has no role in DB, assigned USER");
            }
        } else {
            // Jeśli użytkownika nie ma w bazie, przydziel domyślną rolę
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            System.out.println("[JwtAuthenticationConverter] ⚠ User " + email + " not found in DB, assigned USER");
        }

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}
