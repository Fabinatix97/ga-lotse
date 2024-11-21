/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MedicalRegistryEntryProcedureType")
public enum ProcedureTypeDto {
  MEDICAL_REGISTRY_ENTRY,
  MEDICAL_REGISTRY_CITIZEN_DRAFT,
  MEDICAL_REGISTRY_EMPLOYEE_DRAFT,
}
