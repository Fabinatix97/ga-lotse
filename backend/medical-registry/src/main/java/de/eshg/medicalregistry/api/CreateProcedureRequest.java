/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
  @Type(CreateFullProcedureChangeRequest.class),
  @Type(CreateDeregistrationProcedureRequest.class)
})
public sealed interface CreateProcedureRequest
    permits CreateDeregistrationProcedureRequest, CreateFullProcedureChangeRequest {

  @JsonProperty
  CreateApplicantDto applicant();

  @JsonProperty
  boolean consentToPrivacyPolicy();

  @JsonProperty
  boolean requestForWrittenConfirmation();
}
