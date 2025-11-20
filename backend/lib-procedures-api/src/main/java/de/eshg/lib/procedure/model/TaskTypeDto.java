/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TaskType")
public enum TaskTypeDto {
  BOOK_APPOINTMENT,
  PERFORM_SCHOOL_ENTRY_EXAMINATION,
  INSPECTION_PLANNING,
  INSPECTION_EXECUTION,
  INSPECTION_REPORT,
  TRAVEL_MEDICINE,
  MEASLES_PROTECTION,
  STI_PROTECTION,
  OFFICIAL_MEDICAL_SERVICE,
  MEDS_ABROAD,
  PROSTITUTE_PROTECTION
}
