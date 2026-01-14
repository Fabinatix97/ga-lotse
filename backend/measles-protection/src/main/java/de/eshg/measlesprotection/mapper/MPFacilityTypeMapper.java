/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import de.eshg.measlesprotection.persistence.db.MPFacilityType;

public final class MPFacilityTypeMapper {

  private MPFacilityTypeMapper() {}

  public static MPFacilityType toDomainType(MPFacilityTypeDto facilityTypeDto) {
    return switch (facilityTypeDto) {
      case SCHOOL -> MPFacilityType.SCHOOL;
      case DAY_NURSERY -> MPFacilityType.DAY_NURSERY;
      case DAYCARE -> MPFacilityType.DAYCARE;
      case HOSPITAL -> MPFacilityType.HOSPITAL;
      case MEDICAL_PRACTICE -> MPFacilityType.MEDICAL_PRACTICE;
      case CHILDRENS_HOME -> MPFacilityType.CHILDRENS_HOME;
      case REFUGEE_ACCOMMODATION -> MPFacilityType.REFUGEE_ACCOMMODATION;
      case OUTPATIENT_SURGERY -> MPFacilityType.OUTPATIENT_SURGERY;
      case REHABILITATION_CENTRE -> MPFacilityType.REHABILITATION_CENTRE;
      case DIALYSIS_CENTRE -> MPFacilityType.DIALYSIS_CENTRE;
      case DAY_CLINIC -> MPFacilityType.DAY_CLINIC;
      case MATERNITY_CENTRE -> MPFacilityType.MATERNITY_CENTRE;
      case OTHER_MEDICAL_PRACTICE -> MPFacilityType.OTHER_MEDICAL_PRACTICE;
      case PUBLIC_HEALTH_SERVICE -> MPFacilityType.PUBLIC_HEALTH_SERVICE;
      case EMERGENCY_SERVICE -> MPFacilityType.EMERGENCY_SERVICE;
      case CIVIL_PROTECTION -> MPFacilityType.CIVIL_PROTECTION;
      case OTHER -> MPFacilityType.OTHER;
    };
  }

  public static MPFacilityTypeDto toInterfaceType(MPFacilityType facilityType) {
    return switch (facilityType) {
      case SCHOOL -> MPFacilityTypeDto.SCHOOL;
      case DAY_NURSERY -> MPFacilityTypeDto.DAY_NURSERY;
      case DAYCARE -> MPFacilityTypeDto.DAYCARE;
      case CHILDRENS_HOME -> MPFacilityTypeDto.CHILDRENS_HOME;
      case REFUGEE_ACCOMMODATION -> MPFacilityTypeDto.REFUGEE_ACCOMMODATION;
      case HOSPITAL -> MPFacilityTypeDto.HOSPITAL;
      case MEDICAL_PRACTICE -> MPFacilityTypeDto.MEDICAL_PRACTICE;
      case OUTPATIENT_SURGERY -> MPFacilityTypeDto.OUTPATIENT_SURGERY;
      case REHABILITATION_CENTRE -> MPFacilityTypeDto.REHABILITATION_CENTRE;
      case DIALYSIS_CENTRE -> MPFacilityTypeDto.DIALYSIS_CENTRE;
      case DAY_CLINIC -> MPFacilityTypeDto.DAY_CLINIC;
      case MATERNITY_CENTRE -> MPFacilityTypeDto.MATERNITY_CENTRE;
      case OTHER_MEDICAL_PRACTICE -> MPFacilityTypeDto.OTHER_MEDICAL_PRACTICE;
      case PUBLIC_HEALTH_SERVICE -> MPFacilityTypeDto.PUBLIC_HEALTH_SERVICE;
      case EMERGENCY_SERVICE -> MPFacilityTypeDto.EMERGENCY_SERVICE;
      case CIVIL_PROTECTION -> MPFacilityTypeDto.CIVIL_PROTECTION;
      case OTHER -> MPFacilityTypeDto.OTHER;
    };
  }
}
