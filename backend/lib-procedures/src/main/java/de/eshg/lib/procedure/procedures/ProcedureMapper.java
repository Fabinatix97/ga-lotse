/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.model.AbstractProcedureDto;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

public interface ProcedureMapper<
    DomainProcedure extends Procedure<DomainProcedure, ?, ?, ?>,
    ProcedureDto extends AbstractProcedureDto> {

  default Map<UUID, List<ProcedureDto>> mapToInterface(
      Map<UUID, List<DomainProcedure>> domainProcedures) {
    return domainProcedures.entrySet().stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Entry::getKey,
                procedureByPersonEntry -> mapToInterface(procedureByPersonEntry.getValue())));
  }

  default List<ProcedureDto> mapToInterface(List<DomainProcedure> domainProcedures) {
    return domainProcedures.stream().map(this::mapToInterface).toList();
  }

  ProcedureDto mapToInterface(DomainProcedure domainProcedure);
}
