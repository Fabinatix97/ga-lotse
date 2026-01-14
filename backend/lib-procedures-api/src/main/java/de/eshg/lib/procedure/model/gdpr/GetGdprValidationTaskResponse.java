/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.constraints.NotNull;

public record GetGdprValidationTaskResponse(@NotNull GdprValidationTaskStatusDto status) {}
