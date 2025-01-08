/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.actor;

import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.UUID;

@Schema(name = "AdminPartialActor")
public record PartialActorDto(
    UUID id,
    String readableName,
    ActorTypeDto type,
    Boolean active,
    Boolean manualCertificate,
    String commonName,
    @Valid CertificateDto currentCertificate,
    @Valid CertificateDto previousCertificate,
    String networkId,
    UUID orgUnitId,
    StagingStatusDto stagingStatus) {}
