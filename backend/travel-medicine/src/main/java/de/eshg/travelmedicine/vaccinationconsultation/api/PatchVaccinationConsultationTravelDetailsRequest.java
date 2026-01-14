/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.lib.common.CountryCode;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record PatchVaccinationConsultationTravelDetailsRequest(
    @NotNull TravelTypeDto travelType,
    @NotNull List<CountryCode> travelDestinations,
    LocalDate travelStartDate,
    Integer travelTimeAmount,
    TravelTimeUnitDto travelTimeUnit) {}
