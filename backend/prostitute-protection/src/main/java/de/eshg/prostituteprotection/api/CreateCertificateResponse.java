/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.constraints.NotNull;
import org.springframework.core.io.Resource;

public record CreateCertificateResponse(
    @NotNull Resource consultationCertificate, Resource registrationCertificate) {}
