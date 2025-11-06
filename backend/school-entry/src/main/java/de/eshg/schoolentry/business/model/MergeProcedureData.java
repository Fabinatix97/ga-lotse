/*
 * Copyright 2025 cronn GmbH
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
    List<ImportCustodianData> custodiansWithDateOfBirth,
    List<ImportCustodianData> custodiansWithoutDateOfBirth,
    String phoneNumber,
    String email,
    Boolean isEntryLevel,
    Boolean isEarlyExamination) {}
