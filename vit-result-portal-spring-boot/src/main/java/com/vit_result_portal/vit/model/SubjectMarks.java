package com.vit_result_portal.vit.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subject_marks",
       uniqueConstraints = @UniqueConstraint(name = "uk_student_subject",
                                             columnNames = {"student_id", "subject_name"}))
@Getter
@Setter
@NoArgsConstructor
public class SubjectMarks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @NotBlank(message = "Subject name is required")
    @Size(min = 2, max = 100, message = "Subject name must be between 2 and 100 characters")
    @Column(name = "subject_name", nullable = false, length = 100)
    private String subjectName;

    @NotNull(message = "MSE marks are required")
    @DecimalMin(value = "0.0", message = "MSE marks cannot be less than 0")
    @DecimalMax(value = "100.0", message = "MSE marks cannot exceed 100")
    @Column(name = "mse_marks", nullable = false)
    private Double mseMarks;

    @NotNull(message = "ESE marks are required")
    @DecimalMin(value = "0.0", message = "ESE marks cannot be less than 0")
    @DecimalMax(value = "100.0", message = "ESE marks cannot exceed 100")
    @Column(name = "ese_marks", nullable = false)
    private Double eseMarks;

    @Column(name = "mse_weighted", nullable = false)
    private Double mseWeighted;

    @Column(name = "ese_weighted", nullable = false)
    private Double eseWeighted;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks;

    public void calculateWeightedMarks() {
        this.mseWeighted = round(mseMarks * 0.30);
        this.eseWeighted = round(eseMarks * 0.70);
        this.totalMarks = round(this.mseWeighted + this.eseWeighted);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
