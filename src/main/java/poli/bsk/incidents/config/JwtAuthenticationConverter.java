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

public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationConverter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String email = jwtTokenUtil.extractEmail(jwt);

        Collection<GrantedAuthority> authorities = new ArrayList<>();

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String role = user.getRole();

            if (role != null && !role.isEmpty()) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
                System.out.println("[JwtAuthenticationConverter] ✓ User " + email + " has role: " + role);
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                System.out.println("[JwtAuthenticationConverter] ⚠ User " + email + " has no role in DB, assigned USER");
            }
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            System.out.println("[JwtAuthenticationConverter] ⚠ User " + email + " not found in DB, assigned USER");
        }

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}
