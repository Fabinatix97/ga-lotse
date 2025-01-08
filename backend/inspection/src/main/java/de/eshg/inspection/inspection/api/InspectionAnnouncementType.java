/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionAnnouncementType")
public enum InspectionAnnouncementType {
  EMAIL("Email"), // default
  PHONE("Telefon");

  public final String description;

  InspectionAnnouncementType(String description) {
    this.description = description;
  }
}
