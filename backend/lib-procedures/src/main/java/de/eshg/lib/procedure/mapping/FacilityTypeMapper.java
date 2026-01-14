/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.model.FacilityTypeDto;

public final class FacilityTypeMapper {

  private FacilityTypeMapper() {}

  public static FacilityTypeDto toInterfaceType(FacilityType facilityType) {
    return switch (facilityType) {
      case SCHOOL -> FacilityTypeDto.SCHOOL;
      case INSPECTION -> FacilityTypeDto.INSPECTION;
      case DAYCARE -> FacilityTypeDto.DAYCARE;
      case HOSPITAL -> FacilityTypeDto.HOSPITAL;
      case MEDICAL_PRACTICE -> FacilityTypeDto.MEDICAL_PRACTICE;
      case REFUGEE_ACCOMMODATION -> FacilityTypeDto.REFUGEE_ACCOMMODATION;
      case OTHER -> FacilityTypeDto.OTHER;
    };
  }
}
