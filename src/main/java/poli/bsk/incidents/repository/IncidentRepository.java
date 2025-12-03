package poli.bsk.incidents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import poli.bsk.incidents.model.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    // Custom query methods can be added here
}
