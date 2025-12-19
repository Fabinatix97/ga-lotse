/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record RegistrationConsultationCertificateData(
    @NotNull PersonData person,
    @NotNull String dateOfConsultation,
    @NotNull boolean inLanguageOfConsultant,
    @NotNull boolean interpreterConsulted,
    @NotNull DepartmentData department) {}
