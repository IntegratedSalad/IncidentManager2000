package poli.bsk.incidents.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import poli.bsk.incidents.service.IncidentRegistrationService;
import poli.bsk.incidents.model.Incident;
import poli.bsk.incidents.dto.RegisterIncidentDTO;

@RestController
@RequestMapping("/incident")
public class IncidentRegistrationController {

    private final IncidentRegistrationService incidentRegistrationService;

    public IncidentRegistrationController(IncidentRegistrationService incidentRegistrationService) {
        this.incidentRegistrationService = incidentRegistrationService;
    }

    @PostMapping
    public ResponseEntity<Incident> registerIncident(@RequestBody RegisterIncidentDTO registerIncidentDTO) {
        Incident incident = incidentRegistrationService.registerIncident(
            registerIncidentDTO.getReportedBy(),
            registerIncidentDTO.getTitle(),
            registerIncidentDTO.getDescription(),
            registerIncidentDTO.getCategory()
        );
        return new ResponseEntity<>(incident, HttpStatus.CREATED);
    }
}
