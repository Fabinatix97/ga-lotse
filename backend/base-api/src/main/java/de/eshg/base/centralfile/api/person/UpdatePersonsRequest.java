/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(
    description =
"""
Request used for performing the consistent updates of file states and their associated reference persons in a bulk operation
""")
public record UpdatePersonsRequest(
    @NotNull @Valid @Size(min = 1, max = 10_000)
        List<@NotNull @Valid UpdatePersonInBulkRequest> updateRequests) {}
