/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import java.util.Set;
import org.springframework.web.bind.annotation.BindParam;

public record GetMeaslesProtectionProceduresFilterOptions(
    @BindParam("creationDate")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'creationDate' is submitted, only measles procedures which were created at the provided date are returned.
        - If no 'creationDate' is submitted, no filtering takes place.
        """)
        LocalDate creationDate,
    @BindParam("birthday")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'birthday' is submitted, only measles procedures with affected persons born on the provided date are returned.
        - If no 'birthday' is submitted, no filtering takes place.
        """)
        LocalDate birthday,
    @BindParam("facilityType")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'facilityType' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'facilityType' is submitted, no filtering takes place.
        """)
        Set<MPFacilityTypeDto> facilityType,
    @BindParam("caseStatus")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'caseStatus' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'caseStatus' is submitted, no filtering takes place.
        """)
        Set<CaseStatusDto> caseStatus,
    @BindParam("procedureStatus")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'procedureStatus' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'procedureStatus' is submitted, no filtering takes place.
        """)
        Set<ProcedureStatusDto> procedureStatus,
    @BindParam("roleStatus")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'roleStatus' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'roleStatus' is submitted, no filtering takes place.
        """)
        Set<RoleStatusDto> roleStatus,
    @BindParam("hasAppointment")
        @Parameter(
            description =
                """
        Filter logic:
        - If true, only measles procedures are returned which have an appointment.
        - If false, only measles procedures are returned which do not have an appointment.
        - If null, no filtering takes place.
        """)
        Boolean hasAppointment,
    @BindParam("measure")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'measure' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'measure' is submitted, no filtering takes place.
        """)
        Set<MeasureDto> measure,
    @BindParam("proofRequestSent")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'proofRequestSent' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'proofRequestSent' is submitted, no filtering takes place.
        """)
        Set<ProofRequestSentDto> proofRequestSent,
    @BindParam("proofSubmissionResult")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'proofSubmissionResult' is submitted, only measles procedures are returned which have one of the provided types.
        - If no 'proofSubmissionResult' is submitted, no filtering takes place.
        """)
        Set<SubmissionResultDto> proofSubmissionResult) {}
