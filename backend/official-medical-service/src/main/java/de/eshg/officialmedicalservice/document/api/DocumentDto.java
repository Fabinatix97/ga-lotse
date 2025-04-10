/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.api;

import de.eshg.officialmedicalservice.file.api.OmsFileDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "Document")
public record DocumentDto(
    @NotNull UUID id,
    @NotNull String documentTypeDe,
    String documentTypeEn,
    String helpTextDe,
    String helpTextEn,
    @NotNull DocumentStatusDto documentStatus,
    Instant lastDocumentUpload,
    @NotNull @Valid List<OmsFileDto> files,
    String note,
    @NotNull boolean mandatoryDocument,
    @NotNull boolean uploadInCitizenPortal,
    String reasonForRejection,
    DocumentUploadedByDto uploadedBy,
    String labCode) {}
