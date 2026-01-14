/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;

public record UpdateProcedureRequest(
    RoleStatusDto roleStatus, @Valid UpdateReportDataDto reportData) {

  public UpdateProcedureRequest(RoleStatusDto roleStatusDto) {
    this(roleStatusDto, null);
  }

  @AssertTrue(message = "Either roleStatus or reportData must be set")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isUpdateRequestValid() {
    return roleStatus != null || reportData != null;
  }
}
