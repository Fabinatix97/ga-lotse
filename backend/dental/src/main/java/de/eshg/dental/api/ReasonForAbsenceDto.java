/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ReasonForAbsence")
public enum ReasonForAbsenceDto {
  /** nicht erschienen */
  NOT_APPEARED,
  /** versetzt */
  SHIFTED,
  /** umgezogen */
  MOVED,
  /** verweigert */
  REFUSED
}
