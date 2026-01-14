/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MedicalOpinionStatus")
public enum MedicalOpinionStatusDto {
  IN_PROGRESS,
  ACCOMPLISHED,
}
