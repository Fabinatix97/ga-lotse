/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import static org.apache.commons.text.CaseUtils.toCamelCase;

public enum AppointmentType {
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
  PROSTITUTE_PROTECTION_CONSULTATION,
  INFECTION_BRIEFING_NEW,
  INFECTION_BRIEFING_REPLACEMENT;

  public String toCamelCaseName() {
    return toCamelCase(name(), false, '_');
  }
}
