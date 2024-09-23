/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.measlesprotection.api.GetProceduresForPersonResponse;
import de.eshg.measlesprotection.api.ProcedureForPersonDto;
import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.api.ReportingReasonDto;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class GetProceduresForPersonMapper {

  private final Clock clock;

  public GetProceduresForPersonMapper(Clock clock) {
    this.clock = clock;
  }

  public GetProceduresForPersonResponse map(List<MeaslesProtectionProcedure> source) {
    List<ProcedureForPersonDto> procedures = source.stream().map(this::mapProcedure).toList();
    return new GetProceduresForPersonResponse(procedures);
  }

  private ProcedureForPersonDto mapProcedure(MeaslesProtectionProcedure procedure) {
    final LocalDate reportingDate;
    final ReportingReasonDto reportingReason;
    if (procedure.getProcedureStatus() == ProcedureStatus.DRAFT) {
      reportingDate = procedure.getCreatedAt().atZone(clock.getZone()).toLocalDate();
      reportingReason = null;
    } else {
      ReportDataDto reportingData = ReportDataMapper.toInterfaceType(procedure.getReportData());
      reportingDate = reportingData.reportingDate();
      reportingReason = reportingData.reportingReason();
    }
    return new ProcedureForPersonDto(
        procedure.getExternalId(),
        reportingDate,
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        reportingReason);
  }
}
