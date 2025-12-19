/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetProcedureDraftResponse(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull ProcedureStatusDto status,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull TypeOfChangeDto typeOfChange,
    @NotNull @Valid ApplicantDto applicant,
    @Valid ProfessionInformationDto professionInformation,
    @NotNull @Valid List<PracticeDto> practices,
    @NotNull @Valid List<EmployeeChangeDto> employeeChanges,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements GetProcedureResponse {}
