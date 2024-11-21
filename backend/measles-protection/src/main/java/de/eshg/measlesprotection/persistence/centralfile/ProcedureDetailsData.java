/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.measlesprotection.api.AccessRestrictionDto;
import de.eshg.measlesprotection.api.CaseStatusDto;
import de.eshg.measlesprotection.api.MonetaryFineDto;
import de.eshg.measlesprotection.api.ProofSubmissionDto;
import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProcedureDetailsData(
    UUID externalId,
    Instant createdAt,
    ProcedureStatus procedureStatus,
    RoleStatus roleStatus,
    GetPersonFileStateResponse person,
    List<GetPersonFileStateResponse> custodians,
    FacilityData facilityData,
    List<ProofSubmissionDto> proofSubmissions,
    ReportDataDto reportDataDto,
    List<MonetaryFineDto> monetaryFines,
    AccessRestrictionDto accessRestriction,
    CaseStatusDto caseStatusDto,
    AppointmentDto appointmentDto,
    de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure procedure) {}
