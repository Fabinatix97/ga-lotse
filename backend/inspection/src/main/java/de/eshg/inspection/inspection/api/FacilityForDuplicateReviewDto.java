/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "FacilityForDuplicateReview")
public record FacilityForDuplicateReviewDto(
    // note: referenceId may not be persisted!
    @NotNull UUID referenceId,
    // objectType is only set for the entry representing the imported inspection/facility
    @Valid ObjectTypeRefDto objectType,
    @NotNull String name,
    @NotNull String street,
    String houseNo,
    String addressAddition,
    @NotNull String postalCode,
    @NotNull String city,
    @NotNull List<String> emailAddresses,
    @NotNull List<String> phoneNumbers) {}
