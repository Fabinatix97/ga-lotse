/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.model;

public enum MedicalRegistrySystemProgressEntryType {
  NEW_REGISTRATION,
  SECOND_PRACTICE,
  RE_REGISTRATION,
  CHANGE_OF_REGISTRATION,
  CHANGE_OF_NAME,
  RELOCATION,
  DEREGISTRATION,
  CHANGE_OF_EMPLOYEES,
  OTHER,
  DOCUMENT_UPLOAD,
  REQUEST_FOR_WRITTEN_CONFIRMATION
}
