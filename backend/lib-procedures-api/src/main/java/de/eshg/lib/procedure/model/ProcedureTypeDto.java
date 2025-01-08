/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProcedureType")
public enum ProcedureTypeDto {
  REGULAR_EXAMINATION,
  CAN_CHILD,
  ENTRY_LEVEL,
  DRAFT_CITIZEN_OFFICE_IMPORT,
  DRAFT_SCHOOL_IMPORT,
  INSPECTION,
  TM_VACCINATION_CONSULTATION,
  MEASLES_PROTECTION,
  STI_PROTECTION,
  MEDICAL_REGISTRY_ENTRY,
  MEDICAL_REGISTRY_CITIZEN_DRAFT,
  MEDICAL_REGISTRY_EMPLOYEE_DRAFT,
  DENTAL_CHILD,
  OFFICIAL_MEDICAL_SERVICE,
}
