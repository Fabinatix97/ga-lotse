/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

public record GetGdprDownloadsResponse(@NotNull Set<UUID> downloadIds) {}
