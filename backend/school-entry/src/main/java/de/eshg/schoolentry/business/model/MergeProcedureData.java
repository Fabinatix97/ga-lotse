/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.lib.common.CountryCode;
import java.util.List;
import java.util.UUID;

public record MergeProcedureData(
    UUID procedureId,
    String placeOfBirth,
    CountryCode countryOfBirth,
    List<ImportCustodianData> custodians,
    String phoneNumber,
    Boolean isEntryLevel,
    Boolean isEarlyExamination) {}
