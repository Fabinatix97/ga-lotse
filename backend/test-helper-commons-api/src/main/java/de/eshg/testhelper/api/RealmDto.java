/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Realm")
public enum RealmDto {
  EMPLOYEES,
  CITIZENS;
}
