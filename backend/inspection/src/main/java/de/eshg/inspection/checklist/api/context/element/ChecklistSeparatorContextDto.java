/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context.element;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Objects;

@Schema(name = "CLSeparatorContext")
@JsonInclude(Include.NON_NULL)
public class ChecklistSeparatorContextDto extends ChecklistElementContextDto {

  /**
   * A title for this separator. Currently unused but reserved for future use.
   *
   * <p><b>PLEASE DON'T REMOVE THIS!</b> Due to a bug in the Typescript generator, this subclass of
   * <code>ChecklistElementContextDto</code> must have at least one property, otherwise the
   * generator generates buggy code.
   */
  private String title;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    ChecklistSeparatorContextDto that = (ChecklistSeparatorContextDto) o;
    return Objects.equals(title, that.title);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), title);
  }
}
