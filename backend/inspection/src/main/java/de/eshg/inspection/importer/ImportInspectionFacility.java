/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import jakarta.validation.constraints.NotNull;

record ImportInspectionFacility(
    String importId, ObjectType objectType, @NotNull FacilityDetailsDto facilityDetailsDto) {}
