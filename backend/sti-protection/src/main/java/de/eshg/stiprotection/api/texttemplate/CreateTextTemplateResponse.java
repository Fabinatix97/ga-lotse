/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateTextTemplateResponse(@NotNull UUID textTemplateId) {}
