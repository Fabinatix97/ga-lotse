/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.api.commons.PaginationParameters;

public record ProcedurePaginationParameters(Integer pageNumber, Integer pageSize)
    implements PaginationParameters {}
