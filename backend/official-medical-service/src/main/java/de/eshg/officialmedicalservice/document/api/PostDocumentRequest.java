/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.api;

import jakarta.validation.constraints.NotNull;

public record PostDocumentRequest(
    @NotNull String documentTypeDe,
    String documentTypeEn,
    String helpTextDe,
    String helpTextEn,
    @NotNull boolean mandatoryDocument,
    @NotNull boolean uploadInCitizenPortal,
    String labCode) {}
