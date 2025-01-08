/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionType")
public enum InspectionType {
  REGULAR, // default
  REGULAR_AFTER_INCIDENTS,
  REVIEW,
  INITIAL,
  COMPLAINT,
  DOCUMENT_INSPECTION,
  IMPORT;

  public boolean isComplaint() {
    return this == REVIEW || this == COMPLAINT || this == DOCUMENT_INSPECTION;
  }
}
