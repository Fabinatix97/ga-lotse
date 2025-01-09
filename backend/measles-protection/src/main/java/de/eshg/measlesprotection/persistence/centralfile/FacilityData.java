/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;

public record FacilityData(
    MPFacilityTypeDto facilityType,
    GetFacilityFileStateResponse facilityDto,
    String otherFacilityTypeInformation) {}
