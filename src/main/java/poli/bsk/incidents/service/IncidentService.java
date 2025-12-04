package poli.bsk.incidents.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import poli.bsk.incidents.model.Incident;
import poli.bsk.incidents.repository.IncidentRepository;
import poli.bsk.incidents.dto.IncidentDTO;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncidentService {
    private final IncidentRepository incidentRepository;

    @Autowired
    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<IncidentDTO> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<IncidentDTO> getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<IncidentDTO> getIncidentsByStatus(String status) {
        return incidentRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IncidentDTO> getIncidentsByPriority(String priority) {
        return incidentRepository.findByPriority(priority).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IncidentDTO> getIncidentsByReportedBy(String reportedBy) {
        return incidentRepository.findByReportedBy(reportedBy).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<IncidentDTO> getIncidentsByAssignedTo(String assignedTo) {
        return incidentRepository.findByAssignedTo(assignedTo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncidentDTO createIncident(IncidentDTO incidentDTO) {
        Incident incident = convertToEntity(incidentDTO);
        incident.setReportedAt(Instant.now());
        incident.setStatus("OPEN");
        Incident saved = incidentRepository.save(incident);
        return convertToDTO(saved);
    }

    public IncidentDTO updateIncident(Long id, IncidentDTO incidentDTO) {
        Optional<Incident> existing = incidentRepository.findById(id);
        if (existing.isPresent()) {
            Incident incident = existing.get();
            if (incidentDTO.getTitle() != null) incident.setTitle(incidentDTO.getTitle());
            if (incidentDTO.getDescription() != null) incident.setDescription(incidentDTO.getDescription());
            if (incidentDTO.getPriority() != null) incident.setPriority(incidentDTO.getPriority());
            if (incidentDTO.getCategory() != null) incident.setCategory(incidentDTO.getCategory());
            if (incidentDTO.getStatus() != null) incident.setStatus(incidentDTO.getStatus());
            if (incidentDTO.getAssignedTo() != null) incident.setAssignedTo(incidentDTO.getAssignedTo());
            if (incidentDTO.getResolution() != null) {
                incident.setResolution(incidentDTO.getResolution());
                if ("RESOLVED".equals(incidentDTO.getStatus())) {
                    incident.setResolvedAt(Instant.now());
                }
            }
            if (incidentDTO.getComments() != null) incident.setComments(incidentDTO.getComments());
            Incident updated = incidentRepository.save(incident);
            return convertToDTO(updated);
        }
        return null;
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }

    private IncidentDTO convertToDTO(Incident incident) {
        IncidentDTO dto = new IncidentDTO();
        dto.setId(incident.getId());
        dto.setTitle(incident.getTitle());
        dto.setDescription(incident.getDescription());
        dto.setReportedBy(incident.getReportedBy());
        dto.setReportedAt(incident.getReportedAt());
        dto.setStatus(incident.getStatus());
        dto.setPriority(incident.getPriority());
        dto.setCategory(incident.getCategory());
        dto.setAssignedTo(incident.getAssignedTo());
        dto.setResolution(incident.getResolution());
        dto.setResolvedAt(incident.getResolvedAt());
        dto.setComments(incident.getComments());
        dto.setAttachments(incident.getAttachments());
        return dto;
    }

    private Incident convertToEntity(IncidentDTO dto) {
        return new Incident(
                dto.getTitle(),
                dto.getDescription(),
                dto.getReportedBy(),
                Instant.now(),
                "OPEN",
                dto.getPriority() != null ? dto.getPriority() : "MEDIUM",
                dto.getCategory(),
                null,
                null,
                null,
                dto.getComments(),
                dto.getAttachments()
        );
    }
}
