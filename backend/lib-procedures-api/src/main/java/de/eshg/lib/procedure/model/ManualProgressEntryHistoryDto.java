/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = "ManualProgressEntryHistory")
public class ManualProgressEntryHistoryDto extends AbstractHistoryDto {

  @Valid private ManualProgressEntryDto manualProgressEntry;

  public ManualProgressEntryDto getManualProgressEntry() {
    return manualProgressEntry;
  }

  public void setManualProgressEntry(ManualProgressEntryDto manualProgressEntry) {
    this.manualProgressEntry = manualProgressEntry;
  }
}
