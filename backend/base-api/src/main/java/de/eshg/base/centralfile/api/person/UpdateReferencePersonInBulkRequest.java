/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateReferencePersonInBulkRequest(
    @NotNull UUID referencePersonId,
    @NotNull UUID latestFileStateId,
    @NotNull long version,
    @NotNull @Valid UpdatePersonRequest personDetails) {}
