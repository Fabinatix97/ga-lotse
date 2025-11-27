/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.util;

/** Note: All enum constants must have corresponding translations in the frontend. */
public enum ProstituteProtectionProgressEntryType {
  INITIAL_CONSULTATION_EXECUTED("Erst-Beratung wurde durchgeführt."),
  FOLLOW_UP_CONSULTATION_EXECUTED("Folgeberatung wurde durchgeführt."),
  REGISTRATION_CONSULTATION_CERTIFICATE_GENERATED("Beratungszertifikat Anmeldung erstellt."),
  CONSULTATION_CERTIFICATE_GENERATED("Beratungszertifikat erstellt.");

  private final String changeDescription;

  ProstituteProtectionProgressEntryType(String changeDescription) {
    this.changeDescription = changeDescription;
  }

  public String getChangeDescription() {
    return changeDescription;
  }
}
