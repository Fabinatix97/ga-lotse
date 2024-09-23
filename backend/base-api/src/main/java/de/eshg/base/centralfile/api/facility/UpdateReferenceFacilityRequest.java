/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(
    description =
        """
      Request used to modify reference facility data provided the new state in
      facilityDetails and the expected current version number.
      """)
public record UpdateReferenceFacilityRequest(
    @NotNull @Valid FacilityDetailsDto facilityDetails, @NotNull long version) {}
