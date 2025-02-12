/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.api;

import jakarta.validation.constraints.NotNull;

public record PostDocumentRequest(
    @NotNull String documentTypeDe,
    String documentTypeEn,
    String helpTextDe,
    String helpTextEn,
    @NotNull boolean mandatoryDocument,
    @NotNull boolean uploadInCitizenPortal) {}
