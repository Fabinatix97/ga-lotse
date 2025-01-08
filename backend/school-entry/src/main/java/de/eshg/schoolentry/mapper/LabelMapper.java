/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.LabelDto;
import de.eshg.schoolentry.domain.model.Label;
import java.util.List;

public final class LabelMapper {
  private LabelMapper() {}

  public static LabelDto toDto(Label label) {
    return new LabelDto(
        label.getExternalId(),
        label.getVersion(),
        label.getName(),
        label.getDescription(),
        label.getHexColor(),
        label.isReadonly());
  }

  public static List<LabelDto> toDto(List<Label> labels) {
    return labels.stream().map(LabelMapper::toDto).toList();
  }
}
