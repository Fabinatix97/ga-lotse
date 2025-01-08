/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import de.eshg.inspection.checklist.api.context.element.field.ChecklistAudioContextDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "CLAudioField")
public class ChecklistAudioFieldDto extends ChecklistFieldDto {

  @Valid @NotNull private ChecklistAudioContextDto context;
  @Valid @NotNull private List<ChecklistAudioMetaDataDto> audioMetaData;

  @SuppressWarnings("unused") // jackson needs this to resolve polymorph subtypes
  private ChecklistAudioFieldDto() {}

  public ChecklistAudioFieldDto(
      @NotNull ChecklistAudioContextDto context, List<ChecklistAudioMetaDataDto> audioMetaData) {
    this.context = context;
    this.audioMetaData = audioMetaData;
  }

  @NotNull
  public ChecklistAudioContextDto getContext() {
    return context;
  }

  public List<ChecklistAudioMetaDataDto> getAudioMetaData() {
    return audioMetaData;
  }
}
