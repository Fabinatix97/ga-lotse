/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The list of possible parameters by which Contacts can be sorted.")
public enum ContactSortKey {
  NAME,
  TYPE,
  RELEVANCE,
  CATEGORY
}
