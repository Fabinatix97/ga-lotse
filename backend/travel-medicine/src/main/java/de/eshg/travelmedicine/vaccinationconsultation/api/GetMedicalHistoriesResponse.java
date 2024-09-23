/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetMedicalHistoriesResponse(
    @NotNull UUID procedureId, @NotNull @Valid List<MedicalHistoryDto> medicalHistories) {}
