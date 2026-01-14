/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact.model;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ContactsMergedEvent(@NotNull UUID mergedFromId, @NotNull UUID mergedIntoId) {}
