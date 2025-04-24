/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.dental.api.InstitutionForTransitionDto;
import java.util.List;

public record PagedInstitutionsForTransition(
    List<InstitutionForTransitionDto> institutions, long totalNumberOfInstitutions) {}
