/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

public enum PrintDocumentType {
  CONSULTATION_CERTIFICATE("Beratungszertifikat", "Beratungszertifikat"),
  REGISTRATION_CONSULTATION_CERTIFICATE(
      "Beratungszertifikat Anmeldung", "Beratungszertifikat_Anmeldung");

  private final String description;
  private final String fileNamePrefix;

  PrintDocumentType(String description, String fileNamePrefix) {
    this.description = description;
    this.fileNamePrefix = fileNamePrefix;
  }

  public String getDescription() {
    return description;
  }

  public String getFileNamePrefix() {
    return fileNamePrefix;
  }
}
