/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GdprProcedureType", description = "A list of types of GDPR procedures.")
public enum GdprValidationTaskTypeDto {
  RIGHT_OF_ACCESS,
  RIGHT_TO_ERASURE
}
