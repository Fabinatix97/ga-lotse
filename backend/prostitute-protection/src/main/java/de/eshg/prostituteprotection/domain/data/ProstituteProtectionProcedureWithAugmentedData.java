/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.data;

import de.eshg.prostituteprotection.api.UserNameDto;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;

public record ProstituteProtectionProcedureWithAugmentedData(
    ProstituteProtectionProcedure procedure, UserNameDto consultant, UserNameDto creator) {}
