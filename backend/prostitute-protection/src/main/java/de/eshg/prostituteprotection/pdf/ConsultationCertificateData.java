/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record ConsultationCertificateData(
    @NotNull PersonData person,
    @NotNull String dateOfConsultation,
    @NotNull String dateValidTo,
    @NotNull String idDocument,
    @NotNull DepartmentData department) {}
