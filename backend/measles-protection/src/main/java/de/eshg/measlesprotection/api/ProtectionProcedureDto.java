/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(
      value = MeaslesProtectionProcedureDto.class,
      name = MeaslesProtectionProcedureDto.SCHEMA_NAME),
  @Type(value = DraftMeaslesProcedureDto.class, name = DraftMeaslesProcedureDto.SCHEMA_NAME)
})
@Schema(name = "ProtectionProcedure")
public sealed interface ProtectionProcedureDto
    permits MeaslesProtectionProcedureDto, DraftMeaslesProcedureDto {

  UUID id();

  Instant createdAt();

  AffectedPersonDto affectedPerson();

  List<CustodianDto> custodians();

  FacilityDto facility();

  ReportDataDto reportData();

  CaseStatusDto caseStatus();

  ProcedureStatusDto procedureStatus();

  boolean isOpen();
}
