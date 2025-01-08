/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

/**
 * The {@link MPFacilityType} was introduced to minimize the interdependence between various
 * business modules. Rather than expanding the enum entries in {@link
 * de.eshg.lib.procedure.domain.model.FacilityType}, an action that would require modifications to
 * the DB schema and Open-API specifications across all other business modules, we deemed it more
 * efficient to introduce a <b>module-specific</b> facility type.
 */
public enum MPFacilityType {
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
