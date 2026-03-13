/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.api;

import de.eshg.rest.service.i18n.Language;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record PostDocumentRequest(
    @NotNull @Valid Map<Language, String> documentType,
    @NotNull @Valid Map<Language, String> helpText,
    @NotNull boolean mandatoryDocument,
    @NotNull boolean uploadInCitizenPortal,
    String labCode) {}
