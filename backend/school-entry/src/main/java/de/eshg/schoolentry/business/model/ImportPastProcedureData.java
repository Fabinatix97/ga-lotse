/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.domain.model.*;

public record ImportPastProcedureData(
    ImportProcedureData procedureData,
    Anamnesis anamnesis,
    VaccinationStatus vaccinationStatus,
    EyeExaminationResult eyeExaminationResult,
    HearingTestResult hearingTestResult,
    SopessExaminationResult sopessExamination,
    DevelopmentScreening developmentScreening) {}
