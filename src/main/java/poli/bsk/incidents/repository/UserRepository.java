package poli.bsk.incidents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import poli.bsk.incidents.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods can be added here
}
