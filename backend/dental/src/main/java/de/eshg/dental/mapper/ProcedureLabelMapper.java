/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.ProcedureLabelDto;
import de.eshg.dental.domain.model.ProcedureLabel;
import java.util.List;

public final class ProcedureLabelMapper {
  private ProcedureLabelMapper() {}

  public static ProcedureLabelDto toDto(ProcedureLabel procedureLabel) {
    return new ProcedureLabelDto(
        procedureLabel.getExternalId(),
        procedureLabel.getVersion(),
        procedureLabel.getName(),
        procedureLabel.getDescription(),
        procedureLabel.getHexColor());
  }

  public static List<ProcedureLabelDto> toDto(List<ProcedureLabel> procedureLabels) {
    return procedureLabels.stream().map(ProcedureLabelMapper::toDto).toList();
  }
}
