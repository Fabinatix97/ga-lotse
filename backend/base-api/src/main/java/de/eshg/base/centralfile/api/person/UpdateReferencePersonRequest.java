/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(
    description =
        """
        Request used to modify reference person data provided the new state in personDetails
        and the expected current version number.
        """)
public record UpdateReferencePersonRequest(
    @NotNull @Valid PersonDetailsDto personDetails, @NotNull long version) {}
