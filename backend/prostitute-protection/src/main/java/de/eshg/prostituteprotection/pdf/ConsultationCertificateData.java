/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record ConsultationCertificateData(
    @NotNull PersonData person,
    @NotNull String dateOfConsultation,
    @NotNull String dateValidTo,
    @NotNull String idDocument,
    @NotNull DepartmentData department) {}
