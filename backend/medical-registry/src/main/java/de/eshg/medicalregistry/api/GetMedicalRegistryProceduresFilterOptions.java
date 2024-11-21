/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.Set;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetMedicalRegistryProceduresFilterOptions(
    @BindParam(CERTIFICATE_REQUESTED)
        @Parameter(
            description =
                """
        Filter logic:
        - In case of `true` only procedures are returned where a certificate was requested.
        - In case of `false` only procedures are returned where no certificate was requested
        - If not submitted, no filtering takes place
        """)
        Boolean certificateRequested,
    @BindParam(PROCEDURE_STATUS)
        @Parameter(
            description =
                """
        Filter logic:
        - If `procedureStatus` is submitted, only procedures are returned which have one of the submitted statuses.
        - If not submitted, no filtering takes place
        """)
        Set<ProcedureStatusDto> procedureStatus,
    @BindParam(PROFESSIONAL_TITLE)
        @Parameter(
            description =
                """
          Filter logic:
          - If `professionalTitle` is specified, only procedures associated with professionals in one of the given areas are returned.
          - If not submitted, no filtering takes place
          """)
        Set<ProfessionalTitleDto> professionalTitle) {
  public static final String CERTIFICATE_REQUESTED = "certificateRequested";
  public static final String PROCEDURE_STATUS = "procedureStatus";
  public static final String PROFESSIONAL_TITLE = "professionalTitle";
}
