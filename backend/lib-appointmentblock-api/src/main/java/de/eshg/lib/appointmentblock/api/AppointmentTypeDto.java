/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AppointmentType")
public enum AppointmentTypeDto {
  CONSULTATION,
  VACCINATION,
  REGULAR_EXAMINATION,
  CAN_CHILD,
  ENTRY_LEVEL,
  SPECIAL_NEEDS,
  PROOF_SUBMISSION,
  HIV_STI_CONSULTATION,
  SEX_WORK,
  RESULTS_REVIEW,
  OFFICIAL_MEDICAL_SERVICE_SHORT,
  OFFICIAL_MEDICAL_SERVICE_LONG,
  MEDS_ABROAD_CERTIFICATION,
  PROSTITUTE_PROTECTION_CONSULTATION
}
