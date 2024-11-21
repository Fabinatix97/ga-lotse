/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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

  ProfessionalDto professional();

  List<PracticeDto> practices();

  boolean employeesEmployed();

  boolean consentToPrivacyPolicy();

  boolean requestForWrittenConfirmation();
}
