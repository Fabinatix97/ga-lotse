/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api;

import de.eshg.inspection.checklist.api.context.ChecklistContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Schema(name = "Checklist")
public class ChecklistDto {
  private @NotNull UUID id;
  private @NotNull boolean coreChecklist;
  private @Valid @NotNull ChecklistContextDto context;
  private @Valid @NotNull List<ChecklistSectionDto> sections = new ArrayList<>();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public boolean isCoreChecklist() {
    return coreChecklist;
  }

  public void setCoreChecklist(boolean coreChecklist) {
    this.coreChecklist = coreChecklist;
  }

  public ChecklistContextDto getContext() {
    return context;
  }

  public void setContext(ChecklistContextDto context) {
    this.context = context;
  }

  public List<ChecklistSectionDto> getSections() {
    return sections;
  }

  public void setSections(List<ChecklistSectionDto> sections) {
    this.sections = sections;
  }

  public void addSection(ChecklistSectionDto section) {
    this.sections.add(section);
  }
}
