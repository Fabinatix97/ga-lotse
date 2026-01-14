/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.prostituteprotection.domain.model.CertificateType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "EncryptedFile")
public record EncryptedFileOverviewDto(
    @NotNull UUID encryptedFileId,
    @NotNull Instant createdAt,
    @NotNull boolean withAlias,
    @NotNull CertificateType certificateType) {}
