/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "List of possible usages for an address.")
public enum ContactAddressUsage {
  CONTACT_ADDRESS,
  DIFFERENT_BILLING_ADDRESS
}
