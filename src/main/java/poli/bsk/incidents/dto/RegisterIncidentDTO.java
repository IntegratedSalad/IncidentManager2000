package poli.bsk.incidents.dto;

public class RegisterIncidentDTO {
    private String reportedBy;
    private String title;
    private String description;
    private String category;

    public RegisterIncidentDTO() {
    }

    public RegisterIncidentDTO(String reportedBy, String title, String description, String category) {
        this.reportedBy = reportedBy;
        this.title = title;
        this.description = description;
        this.category = category;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
