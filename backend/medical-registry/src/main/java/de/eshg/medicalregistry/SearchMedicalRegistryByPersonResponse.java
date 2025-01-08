/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.lib.procedure.model.AbstractGetProceduresByPersonResponse;
import de.eshg.medicalregistry.api.MedicalRegistryEntrySearchResultDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record SearchMedicalRegistryByPersonResponse(
    @NotNull @Valid Map<UUID, List<MedicalRegistryEntrySearchResultDto>> procedures,
    @NotNull @Valid Map<UUID, GetReferencePersonResponse> resolvedPersons)
    implements AbstractGetProceduresByPersonResponse<MedicalRegistryEntrySearchResultDto> {}
