/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record ConsultationCertificateData(
    @NotNull PersonData person,
    @NotNull String dateOfConsultation,
    @NotNull String dateValidTo,
    @NotNull String idDocument,
    @NotNull boolean diseasePrevention,
    @NotNull boolean birthControl,
    @NotNull boolean pregnancy,
    @NotNull boolean alcoholAndDrugUsage,
    @NotNull boolean referral,
    @NotNull boolean clearing,
    @NotNull DepartmentData department) {}
