/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.ProcedureLabelDto;
import de.eshg.schoolentry.domain.model.ProcedureLabel;
import java.util.List;

public final class ProcedureLabelMapper {
  private ProcedureLabelMapper() {}

  public static ProcedureLabelDto toDto(ProcedureLabel label) {
    return new ProcedureLabelDto(
        label.getExternalId(),
        label.getVersion(),
        label.getName(),
        label.getDescription(),
        label.getHexColor(),
        label.isReadonly());
  }

  public static List<ProcedureLabelDto> toDto(List<ProcedureLabel> labels) {
    return labels.stream().map(ProcedureLabelMapper::toDto).toList();
  }
}
