package poli.bsk.incidents.service;

import org.springframework.stereotype.Service;
import poli.bsk.incidents.model.Incident;
import poli.bsk.incidents.repository.IncidentRepository;

import java.time.Instant;
import java.util.List;

@Service
public class IncidentRegistrationService {
    private final IncidentRepository incidentRepository;

    public IncidentRegistrationService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Incident registerIncident(String reportedBy,
                                     String title,
                                     String description,
                                     String category) {
        Incident incident = new Incident(
            title,
            description,
            reportedBy,
            Instant.now(),    // reportedAt
            "OPEN",   // status
            "none",
            category,
            null, // assignedTo
            null, // resolution
            null, // resolvedAt
            List.of(),       // comments
            List.of()        // attachments
        );
        return incidentRepository.save(incident);
    }
}
