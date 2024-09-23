/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetGdprProcedureDetailsPageResponse(
    @NotNull @Valid GetGdprProcedureResponse procedure,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description =
                        "A list of sets of Reference Data for Persons from the Central Files that is connected in the GDPR procedure."))
        @NotNull
        @Valid
        List<GetReferencePersonResponse> personMatches) {}
