/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ContactType", description = "List of possible types of a Contact.")
public enum ContactTypeDto {
  PERSON,
  INSTITUTION
}
