package poli.bsk.incidents.service;

import org.springframework.stereotype.Service;
import poli.bsk.incidents.model.User;
import poli.bsk.incidents.repository.UserRepository;

@Service
public class UserRegistrationService {
    private final UserRepository userRepository;

    public UserRegistrationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String email, String name, String role) {
        User user = new User(email,name, role);
        return userRepository.save(user);
    }
}
