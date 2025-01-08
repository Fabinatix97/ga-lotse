/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistImageContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "CLImageField")
public class ChecklistImageFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistImageContextDto context;
  @Valid @NotNull private List<ChecklistImageMetaDataDto> imageMetaData;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistImageFieldDto() {}

  public ChecklistImageFieldDto(
      @NotNull ChecklistImageContextDto context, List<ChecklistImageMetaDataDto> imageMetaData) {
    this.context = context;
    this.imageMetaData = imageMetaData;
  }

  @NotNull
  public ChecklistImageContextDto getContext() {
    return context;
  }

  public List<ChecklistImageMetaDataDto> getImageMetaData() {
    return imageMetaData;
  }
}
