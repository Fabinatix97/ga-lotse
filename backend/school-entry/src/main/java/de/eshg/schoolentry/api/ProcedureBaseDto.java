/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

public interface ProcedureBaseDto {
  @Schema(description = "Id of the Procedure.", example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
  UUID id();
}
