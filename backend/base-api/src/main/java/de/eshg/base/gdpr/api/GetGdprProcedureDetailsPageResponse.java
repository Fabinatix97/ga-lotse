/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGdprProcedureDetailsPageResponse(
    @NotNull @Valid GetGdprProcedureResponse procedure,
    @NotNull boolean hasCentralFileDownload,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "Reference Data of Persons from the Central File that has already been confirmed to be linked to this GDPR procedure."))
        @NotNull
        @Valid
        List<GetReferencePersonResponse> linkedCentralFilePersons,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "Reference Data of Facilities from the Central File that has already been confirmed to be linked to this GDPR procedure."))
        @NotNull
        @Valid
        List<GetReferenceFacilityResponse> linkedCentralFileFacilities,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "Search result of likely related Reference Data for Persons from the Central Files for this GDPR procedure."))
        @NotNull
        @Valid
        List<GetReferencePersonResponse> personMatches,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "Search result of likely related Reference Data for Facilities from the Central Files for this GDPR procedure."))
        @NotNull
        @Valid
        List<GetReferenceFacilityResponse> facilityMatches) {}
