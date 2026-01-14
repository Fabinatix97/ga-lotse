/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "OrgUnitType")
public enum OrgUnitTypeDto {
  GA("health department", "Gesundheitsamt"),
  LA("land department", "Landesamt"),
  ZD("central services", "zentrale Dienste"),
  ;

  public final String descriptionEn;
  public final String descriptionDe;

  OrgUnitTypeDto(String descriptionEn, String descriptionDe) {
    this.descriptionEn = descriptionEn;
    this.descriptionDe = descriptionDe;
  }
}
