/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.audit;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetUsernamesResponse(@NotNull List<String> usernames) {}
