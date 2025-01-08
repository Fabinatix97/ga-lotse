/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ConfirmProcedureRequest(
    @NotNull long version,
    @Valid ProfessionalReferencePersonDto professionalReferencePerson,
    @Valid PracticeReferenceFacilityDto practiceReferenceFacility,
    @Valid ProcedureReferenceDto target) {

  public ConfirmProcedureRequest(long version) {
    this(version, null, null, null);
  }

  public ConfirmProcedureRequest(
      long version, ProfessionalReferencePersonDto professionalReferencePerson) {
    this(version, professionalReferencePerson, null, null);
  }

  public ConfirmProcedureRequest(
      long version, PracticeReferenceFacilityDto practiceReferenceFacility) {
    this(version, null, practiceReferenceFacility, null);
  }

  public ConfirmProcedureRequest(
      long version,
      ProfessionalReferencePersonDto professionalReferencePerson,
      ProcedureReferenceDto target) {
    this(version, professionalReferencePerson, null, target);
  }
}
