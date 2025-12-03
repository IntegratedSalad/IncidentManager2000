package poli.bsk.incidents.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import poli.bsk.incidents.service.UserRegistrationService;
import poli.bsk.incidents.model.User;

@RestController
@RequestMapping("/user-registration")
public class UserRegistrationController {

    private final UserRegistrationService userRegistrationService;

    public UserRegistrationController(UserRegistrationService userRegistrationService) {
        this.userRegistrationService = userRegistrationService;
    }

    @PostMapping
    public ResponseEntity<User> registerUser(@RequestParam String email,
                                            @RequestParam String name,
                                            @RequestParam String role) {
        User user = userRegistrationService.registerUser(email, name, role);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
}
