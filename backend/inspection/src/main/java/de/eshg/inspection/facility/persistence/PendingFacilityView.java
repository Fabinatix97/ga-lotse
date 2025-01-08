/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.persistence;

import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record PendingFacilityView(
    @NotNull Facility facility,
    @Nullable InspectionRelatedFacility irf,
    @Nullable Inspection inspection) {}
