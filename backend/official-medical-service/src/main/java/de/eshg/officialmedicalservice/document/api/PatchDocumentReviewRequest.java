/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.api;

import jakarta.validation.constraints.NotNull;

public record PatchDocumentReviewRequest(
    @NotNull ReviewResultDto result, String reasonForRejection) {}
