/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MPFacilityType")
public enum MPFacilityTypeDto {
  SCHOOL,
  DAY_NURSERY,
  DAYCARE,
  CHILDRENS_HOME,
  REFUGEE_ACCOMMODATION,
  HOSPITAL,
  MEDICAL_PRACTICE,
  OUTPATIENT_SURGERY,
  REHABILITATION_CENTRE,
  DIALYSIS_CENTRE,
  DAY_CLINIC,
  MATERNITY_CENTRE,
  OTHER_MEDICAL_PRACTICE,
  PUBLIC_HEALTH_SERVICE,
  EMERGENCY_SERVICE,
  CIVIL_PROTECTION,
  OTHER
}
