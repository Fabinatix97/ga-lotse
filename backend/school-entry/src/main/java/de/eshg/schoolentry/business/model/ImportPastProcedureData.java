/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

public record ImportPastProcedureData(
    ImportProcedureData procedureData,
    ImportAnamnesisData anamnesisData,
    ImportVaccinationStatusData vaccinationStatusData) {}
