/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.base.SalutationDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "FacilityContactPerson")
public record FacilityContactPersonDto(
    String firstName,
    @NotBlank String lastName,
    String phoneNumber,
    @Email String emailAddress,
    String role,
    SalutationDto salutation,
    String title) {}
