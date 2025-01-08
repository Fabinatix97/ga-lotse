/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import java.util.List;

public record GetManualProgressEntryHistoryResponse(
    @Valid List<ManualProgressEntryHistoryDto> manualProgressEntryHistory) {}
