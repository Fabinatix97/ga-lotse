/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api;

import de.eshg.inspection.checklist.api.context.ChecklistSectionContextDto;
import de.eshg.inspection.checklist.api.element.ChecklistElementDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Schema(name = "CLSection")
public class ChecklistSectionDto {

  private @NotNull UUID id;

  private @Valid @NotNull ChecklistSectionContextDto context;
  private @Valid @NotNull List<ChecklistElementDto> elements = new ArrayList<>();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public ChecklistSectionContextDto getContext() {
    return context;
  }

  public void setContext(ChecklistSectionContextDto context) {
    this.context = context;
  }

  public List<ChecklistElementDto> getElements() {
    return elements;
  }

  public void setElements(List<ChecklistElementDto> elements) {
    this.elements = elements;
  }
}
