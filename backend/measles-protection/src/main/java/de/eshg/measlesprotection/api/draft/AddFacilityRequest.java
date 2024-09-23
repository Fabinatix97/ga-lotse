/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.draft;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import de.eshg.measlesprotection.api.ValidOtherFacilityTypeInformation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record AddFacilityRequest(
    @NotNull @Valid AddFacilityFileStateRequest facility,
    @NotNull MPFacilityTypeDto type,
    String otherFacilityTypeInformation)
    implements ValidOtherFacilityTypeInformation {}
