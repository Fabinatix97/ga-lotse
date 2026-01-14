/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LabStatus", description = "The current status of the laboratory tests.")
public enum LabStatusDto {
  OPEN,
  TESTS_REQUESTED,
  TESTS_CONDUCTED,
  RESULTS_RECORDED,
  RESULTS_COMMUNICATED
}
