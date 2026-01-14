/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ImportPersonContactResponse(
    @NotNull @Valid VCardPersonContactDto vCard,
    @NotNull @Valid List<PersonContactDto> matches,
    @Schema(description = "The total number of matches in the response.") @NotNull @Min(0)
        long totalNumberOfMatches) {}
