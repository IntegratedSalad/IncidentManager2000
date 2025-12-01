package poli.bsk.incidents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IncidentsApplication {

	public static void main(String[] args) {
		SpringApplication.run(IncidentsApplication.class, args);
	}

}

// Controllers => Objects that concern HTTP requests
// Services => Business logic
// Repositories => Data access layer
// OAuth2 => Security and authentication