/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

public record ImportVaccinationStatusData(
    Integer vaccinationScheme,
    Integer tetanus,
    Integer diphteria,
    Integer pertussis,
    Integer polio,
    Integer hib,
    Integer hepatitisB,
    Integer mmr,
    Integer varicella,
    Integer meningococcusC,
    Integer pneumococcus,
    Integer hepatitisA,
    Integer tbe,
    Integer rota,
    Integer meningococcusB,
    Boolean perkombiHbv) {}
