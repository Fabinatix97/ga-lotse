/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity;

public enum InformationStatementTemplateState {
  DRAFT, // The template isn't used yet, still editable (maybe accessible through particular user
  // roles)

  FINAL // the template is usable/in use
}
