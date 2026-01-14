/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.servicedirectory.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "ActorResponse")
public record ActorResponseDto(
    UUID id,
    String naturalId,
    String readableName,
    ActorTypeDto type,
    @NotNull boolean active,
    @NotNull boolean manualCertificate,
    String commonName,
    @Valid CertificateDto certificate,
    @Valid ActorMetadataDto actorMetadata,
    String networkId,
    UUID orgUnitId) {}
