/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record DeleteDownloadPackagesRequest(@NotNull List<UUID> downloadIds) {}
