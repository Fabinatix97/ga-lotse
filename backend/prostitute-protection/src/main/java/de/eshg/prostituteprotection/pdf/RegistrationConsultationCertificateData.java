/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record RegistrationConsultationCertificateData(
    @NotNull PersonData person,
    @NotNull String dateOfConsultation,
    @NotNull boolean inLanguageOfConsultant,
    @NotNull boolean withTranslator,
    @NotNull DepartmentData department) {}
