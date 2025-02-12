/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MedicalOpinionStatus")
public enum MedicalOpinionStatusDto {
  IN_PROGRESS,
  ACCOMPLISHED,
}
