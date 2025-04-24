/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ValidateFilesResponse(@NotNull List<String> errorMessages) {}
