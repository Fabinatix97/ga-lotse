/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;

public record ImportPastProcedureData(
    ImportProcedureData procedureData,
    ImportAnamnesisData anamnesisData,
    ImportVaccinationStatusData vaccinationStatusData,
    EyeExaminationResult eyeExaminationResult,
    HearingTestResult hearingTestResult,
    SopessExaminationResult sopessExaminationData,
    DevelopmentScreening developmentScreeningData) {}
