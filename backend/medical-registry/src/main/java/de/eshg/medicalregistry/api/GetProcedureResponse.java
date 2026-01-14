/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import java.util.List;
import java.util.UUID;

@JsonSubTypes({
  @JsonSubTypes.Type(value = GetProcedureDraftResponse.class),
  @JsonSubTypes.Type(value = GetProcedureConfirmedResponse.class)
})
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public sealed interface GetProcedureResponse
    permits GetProcedureDraftResponse, GetProcedureConfirmedResponse {
  UUID id();

  long version();

  ProcedureStatusDto status();

  ProcedureTypeDto procedureType();

  ApplicantDto applicant();

  ProfessionInformationDto professionInformation();

  List<PracticeDto> practices();

  boolean consentToPrivacyPolicy();

  boolean requestForWrittenConfirmation();
}
