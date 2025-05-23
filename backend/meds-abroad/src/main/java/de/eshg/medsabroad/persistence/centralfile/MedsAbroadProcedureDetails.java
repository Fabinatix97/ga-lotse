/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.centralfile;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;

public record MedsAbroadProcedureDetails(
    MedsAbroadProcedure procedure, GetPersonFileStateResponse personDetails) {}
