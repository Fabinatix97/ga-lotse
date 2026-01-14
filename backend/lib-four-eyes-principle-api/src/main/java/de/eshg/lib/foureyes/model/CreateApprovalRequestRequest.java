/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.model;

import jakarta.validation.constraints.NotNull;

public record CreateApprovalRequestRequest(@NotNull String reason) {}
