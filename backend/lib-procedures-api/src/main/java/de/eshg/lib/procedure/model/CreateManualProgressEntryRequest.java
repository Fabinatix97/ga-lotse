/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.constraints.NotNull;

public record CreateManualProgressEntryRequest(
    @NotNull ManualProgressEntryTypeDto manualProgressEntryType,
    String note,
    String keyDocumentType) {}
