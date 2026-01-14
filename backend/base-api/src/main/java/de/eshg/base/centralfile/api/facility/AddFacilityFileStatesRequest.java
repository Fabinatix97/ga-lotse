/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record AddFacilityFileStatesRequest(
    @NotNull @Valid @Size(min = 1, max = 10000)
        List<@NotNull AddFacilityFileStateRequest> facilities) {}
