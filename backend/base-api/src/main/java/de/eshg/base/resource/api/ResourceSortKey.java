/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The list of possible parameters by which Resources can be sorted.")
public enum ResourceSortKey {
  TYPE,
  NAME,
  RELEVANCE
}
