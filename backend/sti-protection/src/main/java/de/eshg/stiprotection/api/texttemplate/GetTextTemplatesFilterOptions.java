/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.Set;
import org.springframework.web.bind.annotation.BindParam;

public record GetTextTemplatesFilterOptions(
    @BindParam("context")
        @Parameter(
            description =
                """
        Filter logic:
        - If 'context' is submitted, only text templates are returned which belong to one of the provided contexts.
        - If no 'context' is submitted, no filtering takes place.
        """)
        Set<TextTemplateContextDto> context) {}
