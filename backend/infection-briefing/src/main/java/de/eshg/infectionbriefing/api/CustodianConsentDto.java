/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CustodionConsentInput")
public enum CustodianConsentDto {
  IN_PERSON,
  WRITTEN
}
