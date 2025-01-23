/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import jakarta.validation.Valid;

public record GetCitizenSelfUserResponse(
    @Valid BundIdUserAttributesDto selfBundIdUserNameDto,
    @Valid MukUserAttributesDto selfMukUserNameDto) {}
