/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PatchVaccinationConsultationPatientRequest(@NotNull @Valid PatientDto patient) {}
