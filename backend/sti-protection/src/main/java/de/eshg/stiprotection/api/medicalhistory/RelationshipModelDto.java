/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "RelationshipModel", description = "Details on the patient’s relationship model.")
public enum RelationshipModelDto {
  NO_COMMITMENT,
  MONOGAMOUS,
  OPEN
}
