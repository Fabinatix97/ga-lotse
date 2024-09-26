/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element.field;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Schema(name = "CLOptionSelectContext")
public abstract class ChecklistOptionSelectContextDto extends ChecklistFieldContextDto {
  @Valid private List<ChecklistFieldOptionContextDto> items = new ArrayList<>();

  public List<ChecklistFieldOptionContextDto> getItems() {
    return items;
  }

  public void setItems(List<ChecklistFieldOptionContextDto> items) {
    this.items = items;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    ChecklistOptionSelectContextDto that = (ChecklistOptionSelectContextDto) o;
    return Objects.equals(items, that.items);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), items);
  }

  @Override
  public String toString() {
    return "ChecklistOptionSelectContextDto{" + "items=" + items + "} " + super.toString();
  }
}
