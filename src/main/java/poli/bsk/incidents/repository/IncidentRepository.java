package poli.bsk.incidents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import poli.bsk.incidents.model.Incident;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(String status);
    List<Incident> findByPriority(String priority);
    List<Incident> findByReportedBy(String reportedBy);
    List<Incident> findByAssignedTo(String assignedTo);
}
