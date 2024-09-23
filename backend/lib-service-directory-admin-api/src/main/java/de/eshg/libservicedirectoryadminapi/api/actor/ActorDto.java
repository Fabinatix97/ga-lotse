/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.actor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AdminActor")
public record ActorDto(
    @NotNull UUID id,
    String naturalId,
    @NotNull String readableName,
    @NotNull ActorTypeDto type,
    @NotNull boolean active,
    @NotNull String commonName,
    @Valid CertificateDto currentCertificate,
    @Valid CertificateDto previousCertificate,
    String networkId,
    @Valid ActorMetadataDto metadata) {}
