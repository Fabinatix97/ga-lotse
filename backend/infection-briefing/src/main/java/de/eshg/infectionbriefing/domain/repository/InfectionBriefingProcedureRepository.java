/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.repository;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;

public interface InfectionBriefingProcedureRepository
    extends ProcedureRepository<InfectionBriefingProcedure> {}
