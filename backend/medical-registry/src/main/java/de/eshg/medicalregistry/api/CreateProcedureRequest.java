/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(CreateFullChangeRequest.class),
  @Type(CreateApplicantChangeRequest.class),
  @Type(CreatePracticeChangeRequest.class),
  @Type(CreateEmployeeChangeRequest.class)
})
public sealed interface CreateProcedureRequest
    permits CreateApplicantChangeRequest,
        CreateEmployeeChangeRequest,
        CreateFullChangeRequest,
        CreatePracticeChangeRequest {

  @JsonProperty
  CreateApplicantDto applicant();

  @JsonProperty
  boolean consentToPrivacyPolicy();

  @JsonProperty
  boolean requestForWrittenConfirmation();
}
