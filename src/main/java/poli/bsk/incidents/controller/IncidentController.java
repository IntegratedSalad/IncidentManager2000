package poli.bsk.incidents.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import poli.bsk.incidents.service.IncidentRegistrationService;
import poli.bsk.incidents.model.Incident;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    public IncidentController() {
    }

    // This controller should handle general incident operations (listing, getting by id, etc.)
}
