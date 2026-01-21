package poli.bsk.incidents.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import poli.bsk.incidents.model.User;
import poli.bsk.incidents.repository.UserRepository;
import poli.bsk.incidents.dto.UserDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDTO);
    }

    public List<UserDTO> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User(userDTO.getEmail(), userDTO.getName(), userDTO.getRole());
        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        Optional<User> existing = userRepository.findById(id);
        if (existing.isPresent()) {
            User user = existing.get();
            if (userDTO.getName() != null) user.setName(userDTO.getName());
            if (userDTO.getRole() != null) user.setRole(userDTO.getRole());
            User updated = userRepository.save(user);
            return convertToDTO(updated);
        }
        return null;
    }

    public UserDTO syncUser(UserDTO userDTO) {
        // Create or update user based on email
        Optional<User> existing = userRepository.findByEmail(userDTO.getEmail());
        User user;
        
        if (existing.isPresent()) {
            // User exists, update name and role from DTO
            user = existing.get();
            if (userDTO.getName() != null) {
                user.setName(userDTO.getName());
            }
            // Always update role from DTO (client-provided role takes precedence)
            if (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) {
                user.setRole(userDTO.getRole());
                System.out.println("[UserService.syncUser] ✓ Updated user " + userDTO.getEmail() + " role to: " + userDTO.getRole());
            }
        } else {
            // Create new user with role from DTO
            String role = (userDTO.getRole() != null && !userDTO.getRole().isEmpty()) ? userDTO.getRole() : "User";
            user = new User(userDTO.getEmail(), userDTO.getName(), role);
            System.out.println("[UserService.syncUser] ✓ Created user " + userDTO.getEmail() + " with role: " + role);
        }
        
        User saved = userRepository.save(user);
        System.out.println("[UserService.syncUser] ✓ Saved user to DB: " + saved.getEmail() + " with role: " + saved.getRole());
        return convertToDTO(saved);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        return dto;
    }
}
