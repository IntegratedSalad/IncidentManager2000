package poli.bsk.incidents.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import poli.bsk.incidents.service.IncidentService;
import poli.bsk.incidents.dto.IncidentDTO;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService incidentService;

    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<List<IncidentDTO>> getAllIncidents() {
        List<IncidentDTO> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<IncidentDTO> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<List<IncidentDTO>> getIncidentsByStatus(@PathVariable String status) {
        List<IncidentDTO> incidents = incidentService.getIncidentsByStatus(status);
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<List<IncidentDTO>> getIncidentsByPriority(@PathVariable String priority) {
        List<IncidentDTO> incidents = incidentService.getIncidentsByPriority(priority);
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/reporter/{reportedBy}")
    public ResponseEntity<List<IncidentDTO>> getIncidentsByReporter(@PathVariable String reportedBy) {
        List<IncidentDTO> incidents = incidentService.getIncidentsByReportedBy(reportedBy);
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/assigned/{assignedTo}")
    public ResponseEntity<List<IncidentDTO>> getIncidentsByAssignee(@PathVariable String assignedTo) {
        List<IncidentDTO> incidents = incidentService.getIncidentsByAssignedTo(assignedTo);
        return ResponseEntity.ok(incidents);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Ticket.Resolve', 'Ticket.Open')")
    public ResponseEntity<IncidentDTO> createIncident(@RequestBody IncidentDTO incidentDTO) {
        IncidentDTO created = incidentService.createIncident(incidentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<IncidentDTO> updateIncident(@PathVariable Long id, @RequestBody IncidentDTO incidentDTO) {
        IncidentDTO updated = incidentService.updateIncident(id, incidentDTO);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Ticket.Resolve')")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
