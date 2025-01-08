/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.citizenportal;

import de.eshg.base.centralfile.api.facility.ExternalAddFacilityFileStateRequest;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ReportCaseRequest(
    @NotNull @Valid ExternalAddFacilityFileStateRequest facility,
    @NotNull MPFacilityTypeDto type,
    String otherFacilityTypeInformation,
    @Valid List<ReportPersonDto> affectedPersons) {}
