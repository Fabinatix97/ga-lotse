/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record PostPutCertificateRequest(
    @NotNull CertificateTypeDto type,
    @NotNull UUID procedureStepId,
    @NotNull @NotEmpty List<UUID> serviceIds) {}
