/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.centralfile.persistence.entity.FacilityContactPerson;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record FacilityContactPersonsDiffWrapper(
    @NotNull @Valid List<FacilityContactPerson> fileStateContactPersons,
    @NotNull @Valid List<FacilityContactPerson> referenceContactPersons) {}
