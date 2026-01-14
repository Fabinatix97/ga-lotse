/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FollowupType")
public enum FollowupType {
  REVIEW(InspectionType.REVIEW),
  DOCUMENT_INSPECTION(InspectionType.DOCUMENT_INSPECTION);

  public final InspectionType asInspectionType;

  FollowupType(InspectionType asInspectionType) {
    this.asInspectionType = asInspectionType;
  }
}
