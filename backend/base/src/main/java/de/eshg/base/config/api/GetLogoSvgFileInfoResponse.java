/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import de.eshg.config.api.DocumentDetailsDto;
import jakarta.validation.Valid;

public record GetLogoSvgFileInfoResponse(@Valid DocumentDetailsDto logoSvgInfo) {}
