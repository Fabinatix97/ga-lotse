/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ConfirmProcedureRequest(
    @NotNull long version,
    @Valid ProfessionalReferencePersonDto professionalReferencePerson,
    @Valid PracticeReferenceFacilityDto practiceReferenceFacility,
    @Valid ProcedureReferenceDto target,
    @NotNull @Valid List<ResolvedEmployeeChangeDto> employeeChanges) {

  public ConfirmProcedureRequest(long version) {
    this(version, null, null, null, List.of());
  }

  public ConfirmProcedureRequest(
      long version, ProfessionalReferencePersonDto professionalReferencePerson) {
    this(version, professionalReferencePerson, null, null, List.of());
  }

  public ConfirmProcedureRequest(
      long version, PracticeReferenceFacilityDto practiceReferenceFacility) {
    this(version, null, practiceReferenceFacility, null, List.of());
  }

  public ConfirmProcedureRequest(
      long version,
      ProfessionalReferencePersonDto professionalReferencePerson,
      ProcedureReferenceDto target) {
    this(version, professionalReferencePerson, null, target, List.of());
  }
}
