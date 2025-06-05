/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.medicalregistry.api.EmployeeChangeDto;
import de.eshg.medicalregistry.api.PersonCandidateDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "EmployeeChoice")
public record EmployeeChoiceDto(
    @NotNull EmployeeChangeDto employeeChange,
    @NotEmpty @Valid List<PersonCandidateDto> personCandidates) {}
