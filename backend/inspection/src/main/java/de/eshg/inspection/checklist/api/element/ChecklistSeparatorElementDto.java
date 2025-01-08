/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element;

import de.eshg.inspection.checklist.api.context.element.ChecklistSeparatorContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CLSeparatorElement")
public class ChecklistSeparatorElementDto extends ChecklistElementDto {

  @Valid @NotNull private ChecklistSeparatorContextDto context;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistSeparatorElementDto() {}

  public ChecklistSeparatorElementDto(ChecklistSeparatorContextDto context) {
    this.context = context;
  }

  public ChecklistSeparatorContextDto getContext() {
    return context;
  }
}
