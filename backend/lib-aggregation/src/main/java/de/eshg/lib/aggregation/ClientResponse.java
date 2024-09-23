/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import de.eshg.rest.service.error.ErrorResponseWithLocation;

public record ClientResponse<R>(
    String location, R response, ErrorResponseWithLocation errorResponse) {}
