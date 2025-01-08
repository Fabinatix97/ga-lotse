/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "ContactDetails")
public record ContactDetailsDto(
    @NotNull ContactTypeDto contactType,
    String facilityName,
    String firstName,
    String lastName,
    TitleDto title,
    LocalDate dateOfBirth,
    String emailAddress,
    String phoneNumber,
    @Valid InboxProcedureAddressDto address) {}
