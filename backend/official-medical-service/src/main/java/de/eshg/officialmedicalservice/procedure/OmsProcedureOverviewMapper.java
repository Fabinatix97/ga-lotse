/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.CreatedByUserType;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsTask;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class OmsProcedureOverviewMapper {
  private final Clock clock;
  private final AuditLogger auditLogger;

  public OmsProcedureOverviewMapper(Clock clock, AuditLogger auditLogger) {
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public OmsProcedure toDomainType(
      PostEmployeeOmsProcedureRequest request, UUID currentUserId, CreatedByUserType userType) {
    OmsProcedure procedure = new OmsProcedure();

    procedure.setProcedureType(ProcedureType.OFFICIAL_MEDICAL_SERVICE);
    ProcedureStatus procedureStatus =
        userType == CreatedByUserType.CITIZEN_PORTAL ? ProcedureStatus.DRAFT : ProcedureStatus.OPEN;
    procedure.updateProcedureStatus(procedureStatus, clock, auditLogger);
    procedure.setCreatedBy(userType);

    OmsTask omsTask = new OmsTask();
    if (currentUserId != null) {
      omsTask.assign(currentUserId, currentUserId, Instant.now(clock));
    }
    omsTask.setTaskType(TaskType.TRAVEL_MEDICINE);
    omsTask.setTaskStatus(TaskStatus.OPEN);
    procedure.addTask(omsTask);

    return procedure;
  }

  public EmployeeOmsProcedureOverviewDto toInterfaceType(OmsProcedure procedure) {
    return new EmployeeOmsProcedureOverviewDto(
        procedure.getExternalId(), ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }
}
