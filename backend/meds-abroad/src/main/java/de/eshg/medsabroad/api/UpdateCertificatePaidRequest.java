/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import jakarta.validation.constraints.NotNull;

public record UpdateCertificatePaidRequest(@NotNull boolean certificatePaid) {}
