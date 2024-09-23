/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

// new name to avoid name conflicts
@Schema(name = "TMCertificate")
public record CertificateDto(
    @NotNull UUID id,
    @NotNull CertificateTypeDto type,
    @NotNull Instant appointment,
    @NotNull UUID progressEntryId,
    UUID certificateFileId,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
