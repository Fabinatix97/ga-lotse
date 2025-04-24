/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

public record UpdateOpenDataConfigRequest(
    @NotNull String author, @NotNull @URL String fallbackLicenseUrl) {}
