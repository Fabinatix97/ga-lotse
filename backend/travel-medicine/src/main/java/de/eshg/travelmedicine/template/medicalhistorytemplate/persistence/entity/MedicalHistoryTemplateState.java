/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.medicalhistorytemplate.persistence.entity;

public enum MedicalHistoryTemplateState {
  DRAFT, // The template isn't used yet, still editable (maybe accessible through particular user
  // roles)

  FINAL // the template is usable/in use
}
