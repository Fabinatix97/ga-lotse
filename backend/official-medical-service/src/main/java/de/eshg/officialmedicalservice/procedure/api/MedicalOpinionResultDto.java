/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
