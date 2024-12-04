/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import de.eshg.lib.common.BusinessModule;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetConfigurationResponse(
    @NotNull long maxFileSize, @NotNull List<BusinessModule> activeModules) {}
