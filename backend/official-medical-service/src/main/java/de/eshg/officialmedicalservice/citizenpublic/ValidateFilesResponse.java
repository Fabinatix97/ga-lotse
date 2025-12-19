/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.citizenpublic;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ValidateFilesResponse(@NotNull List<String> errorMessages) {}
