/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(
    name = "CertificatePopulation",
    description =
        "request the creation of a certificate for some of the services of a step/appointment")
public record CertificatePopulationDto(
    @NotBlank String stepKey, @NotNull @Size(min = 1) List<String> serviceKeys) {}
