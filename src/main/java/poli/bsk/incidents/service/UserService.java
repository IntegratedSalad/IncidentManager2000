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
