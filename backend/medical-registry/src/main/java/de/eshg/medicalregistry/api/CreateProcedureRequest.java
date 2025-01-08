/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
  @Type(CreatePracticeChangeRequest.class)
})
public sealed interface CreateProcedureRequest
    permits CreateApplicantChangeRequest, CreateFullChangeRequest, CreatePracticeChangeRequest {

  @JsonProperty
  CreateApplicantDto applicant();

  @JsonProperty
  boolean consentToPrivacyPolicy();

  @JsonProperty
  boolean requestForWrittenConfirmation();
}
