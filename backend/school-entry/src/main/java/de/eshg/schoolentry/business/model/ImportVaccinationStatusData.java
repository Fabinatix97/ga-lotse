/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

public record ImportVaccinationStatusData(
    int vaccinationScheme,
    int tetanus,
    int diphteria,
    int pertussis,
    int polio,
    int hib,
    int hepatitisB,
    int mmr,
    int varicella,
    int meningococcusC,
    int pneumococcus,
    int hepatitisA,
    int tbe,
    int rota,
    int meningococcusB,
    Boolean perkombiHbv) {}
