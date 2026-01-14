/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InformationStatementTemplateState")
public enum InformationStatementTemplateStateDto {
  DRAFT, // The template isn't used yet, still editable (maybe accessible through particular user
  // roles)

  FINAL // the template is usable/in use
}
