/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.medicalregistry.api.MedicalRegistryEntrySearchResultDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GetConfirmInfoResponse(
    @NotNull Long version,
    @NotNull @Valid List<@NotNull GetReferencePersonResponse> matchingReferencePersons,
    @NotNull @Valid List<@NotNull GetReferenceFacilityResponse> matchingReferenceFacilities,
    @NotNull @Valid
        Map<@NotNull UUID, @NotNull @Valid List<@NotNull MedicalRegistryEntrySearchResultDto>>
            proceduresByReferencePerson,
    @NotNull @Valid
        Map<@NotNull UUID, @NotNull @Valid List<@NotNull EmployeeChoiceDto>>
            employeeChoicesByProcedure) {}
