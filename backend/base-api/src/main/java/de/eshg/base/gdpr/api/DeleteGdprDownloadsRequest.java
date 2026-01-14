/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;
import java.util.UUID;

public record DeleteGdprDownloadsRequest(@NotEmpty Set<UUID> downloadIds) {}
