/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record GetProcedureConfirmedResponse(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull ProcedureStatusDto status,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull @Valid ApplicantDto applicant,
    @NotNull @Valid ProfessionInformationDto professionInformation,
    @NotNull @Valid List<PracticeDto> practices,
    @NotNull @Valid List<EmployeeDto> employees,
    @NotNull boolean consentToPrivacyPolicy,
    @NotNull boolean requestForWrittenConfirmation)
    implements GetProcedureResponse {}
