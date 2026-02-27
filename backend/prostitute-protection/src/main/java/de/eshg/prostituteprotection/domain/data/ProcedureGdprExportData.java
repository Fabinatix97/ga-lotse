/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.data;

import de.eshg.prostituteprotection.api.EncryptedFileOverviewDto;
import de.eshg.prostituteprotection.crypto.DecryptedPersonalDataDto;
import de.eshg.prostituteprotection.domain.model.Consultation;
import java.util.List;

public record ProcedureGdprExportData(
    ProstituteProtectionProcedureWithAugmentedData procedure,
    DecryptedPersonalDataDto decryptedPersonalData,
    Consultation consultation,
    List<EncryptedFileOverviewDto> encryptedFiles) {}
