package poli.bsk.incidents.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import poli.bsk.incidents.util.JwtTokenUtil;

import java.util.Collection;
import java.util.stream.Collectors;

/**
 * Converter JWT na Authentication z rolami
 */
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtTokenUtil jwtTokenUtil;

    public JwtAuthenticationConverter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // Pobierz role z JWT
        Collection<GrantedAuthority> authorities = jwtTokenUtil.extractRoles(jwt)
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // Pobierz email/username
        String principal = jwtTokenUtil.getPrincipal(jwt);

        return new UsernamePasswordAuthenticationToken(principal, null, authorities);
    }
}
