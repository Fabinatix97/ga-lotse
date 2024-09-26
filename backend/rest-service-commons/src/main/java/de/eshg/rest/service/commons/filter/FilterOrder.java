/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import org.springframework.core.Ordered;

public interface FilterOrder {

  int ACTIVE_REQUEST_COUNTER_FILTER_ORDER = Ordered.HIGHEST_PRECEDENCE;
  // make sure to run _before_ the Spring Security filters
  int REQUEST_LOGGING_FILTER_ORDER = ACTIVE_REQUEST_COUNTER_FILTER_ORDER + 1;
}
