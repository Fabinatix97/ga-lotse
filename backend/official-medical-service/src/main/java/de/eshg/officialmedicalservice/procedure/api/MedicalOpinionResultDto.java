/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.officialmedicalservice.procedure.persistence.entity.MedicalOpinionResult;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MedicalOpinionResult")
public enum MedicalOpinionResultDto {
  POSITIVE,
  NEGATIVE,
  NO_VALUATION,
  ;

  public static MedicalOpinionResultDto fromDomainType(MedicalOpinionResult result) {
    if (result == MedicalOpinionResult.UNKNOWN) {
      return null;
    }
    return valueOf(result.name());
  }
}
