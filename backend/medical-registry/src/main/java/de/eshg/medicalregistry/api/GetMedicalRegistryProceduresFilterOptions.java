/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
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
        - `procedureStatus` and `procedureType` are always submitted together
        - If not submitted, no filtering takes place
        """)
        Set<ProcedureStatusDto> procedureStatus,
    @BindParam(PROCEDURE_TYPE)
        @Parameter(
            description =
                """
          Filter logic:
          - If `procedureType` is submitted, only procedures are returned which have one of the submitted types.
          - `procedureStatus` and `procedureType` are always submitted together
          - If not submitted, no filtering takes place
          """)
        Set<ProcedureTypeDto> procedureType,
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
  public static final String PROCEDURE_TYPE = "procedureType";
  public static final String PROFESSIONAL_TITLE = "professionalTitle";
}
