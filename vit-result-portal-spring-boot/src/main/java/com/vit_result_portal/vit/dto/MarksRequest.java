package com.vit_result_portal.vit.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarksRequest {

    @NotBlank(message = "PRN is required")
    private String prn;

    @NotBlank(message = "Subject name is required")
    @Size(min = 2, max = 100, message = "Subject name must be between 2 and 100 characters")
    private String subjectName;

    @NotNull(message = "MSE marks are required")
    @DecimalMin(value = "0.0", message = "MSE marks cannot be less than 0")
    @DecimalMax(value = "100.0", message = "MSE marks cannot exceed 100")
    private Double mseMarks;

    @NotNull(message = "ESE marks are required")
    @DecimalMin(value = "0.0", message = "ESE marks cannot be less than 0")
    @DecimalMax(value = "100.0", message = "ESE marks cannot exceed 100")
    private Double eseMarks;
}
