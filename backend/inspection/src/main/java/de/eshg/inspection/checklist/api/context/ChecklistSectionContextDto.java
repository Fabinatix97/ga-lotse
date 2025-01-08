/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context;

import de.eshg.inspection.checklist.api.context.element.ChecklistElementContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Schema(name = "CLSectionContext")
public class ChecklistSectionContextDto {
  private @NotNull UUID id;
  private String title;
  private @Valid @NotNull List<ChecklistElementContextDto> elements = new ArrayList<>();

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public List<ChecklistElementContextDto> getElements() {
    return elements;
  }

  public void setElements(List<ChecklistElementContextDto> elements) {
    this.elements = elements;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ChecklistSectionContextDto that = (ChecklistSectionContextDto) o;
    return Objects.equals(id, that.id)
        && Objects.equals(title, that.title)
        && Objects.equals(elements, that.elements);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, title, elements);
  }

  @Override
  public String toString() {
    return "ChecklistSectionContextDto{"
        + "id="
        + id
        + ", title='"
        + title
        + '\''
        + ", elements="
        + elements
        + '}';
  }
}
