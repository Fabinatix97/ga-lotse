/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record InvalidateSessionsRequest(@NotNull List<String> sessions) {}
