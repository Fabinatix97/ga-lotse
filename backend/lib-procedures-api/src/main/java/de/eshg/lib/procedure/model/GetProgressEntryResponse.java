/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetProgressEntryResponse(
    @NotNull @Valid ProgressEntryDto progressEntry,
    @NotNull @Valid List<KeyDocumentAwareProgressEntryDto> relatedKeyDocumentProgressEntries) {}
