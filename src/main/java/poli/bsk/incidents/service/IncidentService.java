package poli.bsk.incidents.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import poli.bsk.incidents.model.Incident;
import poli.bsk.incidents.repository.IncidentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {
    private final IncidentRepository incidentRepository;

    @Autowired
    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
