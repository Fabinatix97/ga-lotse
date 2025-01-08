/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.error.ErrorResponseWithLocation;

public record ClientResponse<R>(
    BusinessModule businessModule, R response, ErrorResponseWithLocation errorResponse) {}
