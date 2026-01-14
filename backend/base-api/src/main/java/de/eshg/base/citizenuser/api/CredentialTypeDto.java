/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CredentialType")
public enum CredentialTypeDto {
  PIN,
  DATE_OF_BIRTH
}
