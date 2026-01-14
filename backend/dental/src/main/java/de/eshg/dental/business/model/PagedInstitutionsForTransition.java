/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.business.model;

import de.eshg.dental.api.InstitutionForTransitionDto;
import java.util.List;

public record PagedInstitutionsForTransition(
    List<InstitutionForTransitionDto> institutions, long totalNumberOfInstitutions) {}
