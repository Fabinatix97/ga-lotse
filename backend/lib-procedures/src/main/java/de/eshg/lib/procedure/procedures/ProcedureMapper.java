/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.model.AbstractProcedureDto;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ProcedureMapper<
    DomainProcedure extends Procedure<DomainProcedure, ?, ?, ?>,
    ProcedureDto extends AbstractProcedureDto> {

  Map<UUID, List<ProcedureDto>> mapToInterface(Map<UUID, List<DomainProcedure>> domainProcedures);
}
