/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import de.eshg.base.CountryCodeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "TravelInformation")
public record TravelInformationDto(
    @NotNull TravelTypeDto travelType,
    @NotNull List<CountryCodeDto> travelDestinations,
    LocalDate travelStartDate,
    Integer travelTimeAmount,
    TravelTimeUnitDto travelTimeUnit) {}
