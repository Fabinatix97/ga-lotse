/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import jakarta.validation.constraints.NotNull;

public record CreateManualProgressEntryRequest(
    @CanBeLogged @NotNull ManualProgressEntryTypeDto manualProgressEntryType,
    String subject,
    String messageText,
    String note,
    @CanBeLogged KeyDocumentTypeDto keyDocumentType) {}
