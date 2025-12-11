/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.constraints.NotNull;
import org.springframework.core.io.Resource;

public record CreateCertificateResponse(
    @NotNull Resource consultationCertificate, Resource registrationCertificate) {}
