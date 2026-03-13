/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.api;

import de.eshg.officialmedicalservice.file.api.OmsFileDto;
import de.eshg.rest.service.i18n.Language;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Schema(name = "Document")
public record DocumentDto(
    @NotNull UUID id,
    @NotNull @Valid Map<Language, String> documentType,
    @NotNull @Valid Map<Language, String> helpText,
    @NotNull DocumentStatusDto documentStatus,
    Instant lastDocumentUpload,
    @NotNull @Valid List<OmsFileDto> files,
    String note,
    @NotNull boolean mandatoryDocument,
    @NotNull boolean uploadInCitizenPortal,
    String reasonForRejection,
    DocumentUploadedByDto uploadedBy,
    String labCode) {}
