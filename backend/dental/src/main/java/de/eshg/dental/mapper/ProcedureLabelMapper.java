/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
