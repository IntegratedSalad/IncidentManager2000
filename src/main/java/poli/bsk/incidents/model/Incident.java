package poli.bsk.incidents.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "incidents")
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String reportedBy;
    private Instant reportedAt;
    private String status;
    private String priority;
    private String category;
    private String assignedTo;
    private String resolution;
    private Instant resolvedAt;

    @ElementCollection
    private List<String> comments;

    @ElementCollection
    private List<String> attachments;

    public Incident() {
    }

    public Incident(String title,
                    String description,
                    String reportedBy,
                    Instant reportedAt,
                    String status,
                    String priority,
                    String category,
                    String assignedTo,
                    String resolution,
                    Instant resolvedAt,
                    List<String> comments,
                    List<String> attachments) {
        this.title = title;
        this.description = description;
        this.reportedBy = reportedBy;
        this.reportedAt = reportedAt;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.assignedTo = assignedTo;
        this.resolution = resolution;
        this.resolvedAt = resolvedAt;
        this.comments = comments;
        this.attachments = attachments;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }
    public Instant getReportedAt() { return reportedAt; }
    public void setReportedAt(Instant reportedAt) { this.reportedAt = reportedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public List<String> getComments() { return comments; }
    public void setComments(List<String> comments) { this.comments = comments; }
    public List<String> getAttachments() { return attachments; }
}
