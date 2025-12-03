package poli.bsk.incidents.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import poli.bsk.incidents.service.IncidentRegistrationService;
import poli.bsk.incidents.model.Incident;

@RestController
@RequestMapping("/incident")
public class IncidentRegistrationController {

    private final IncidentRegistrationService incidentRegistrationService;

    public IncidentRegistrationController(IncidentRegistrationService incidentRegistrationService) {
        this.incidentRegistrationService = incidentRegistrationService;
    }

    @PostMapping
    public ResponseEntity<Incident> registerIncident(@RequestParam String reportedBy,
                                                    @RequestParam String title,
                                                    @RequestParam String description,
                                                    @RequestParam String category,
                                                    @RequestParam String priority) {
        Incident incident = incidentRegistrationService.registerIncident(
            reportedBy, title, description, category, priority
        );
        return new ResponseEntity<>(incident, HttpStatus.CREATED);
    }
}
