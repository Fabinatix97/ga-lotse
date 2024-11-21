/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GdprProcedureType", description = "A list of types of GDPR procedures.")
public enum GdprProcedureTypeDto {
  RIGHT_OF_ACCESS,
  RIGHT_TO_ERASURE,
  RIGHT_TO_OBJECT,
  RIGHT_TO_RECTIFICATION,
}
