package com.vit_result_portal.vit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "PRN is required")
    @Size(min = 6, max = 30, message = "PRN must be between 6 and 30 characters")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "PRN can contain only letters and numbers")
    @Column(nullable = false, unique = true, length = 30)
    private String prn;

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Mother's name is required")
    @Size(min = 2, max = 100, message = "Mother's name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String motherName;

    @NotBlank(message = "Branch is required")
    @Size(max = 100, message = "Branch is too long")
    @Column(nullable = false, length = 100)
    private String branch;

    @NotBlank(message = "Semester is required")
    @Column(nullable = false, length = 30)
    private String semester;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubjectMarks> marks = new ArrayList<>();
}
