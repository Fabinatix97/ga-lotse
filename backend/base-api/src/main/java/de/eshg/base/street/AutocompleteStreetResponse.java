/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.base.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record AutocompleteStreetResponse(
    @Schema(
            description = "A list of street names which are results of the autocompletion",
            example = "['Hauptpfad','Hauptstraße','Hauptweg']")
        @NotNull
        List<String> elements,
    @Schema(description = "The number of streets in the response") @NotNull
        long totalNumberOfElements)
    implements PagedResponse<String> {}
