/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TypeOfApplicantChange")
public enum TypeOfApplicantChangeDto {
  DEREGISTRATION,
  RELOCATION,
  CHANGE_OF_NAME
}
