/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
