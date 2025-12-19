/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MedicalRegistryEntryProcedureType")
public enum ProcedureTypeDto {
  MEDICAL_REGISTRY_ENTRY,
  MEDICAL_REGISTRY_CITIZEN_DRAFT,
  MEDICAL_REGISTRY_EMPLOYEE_DRAFT,
}
