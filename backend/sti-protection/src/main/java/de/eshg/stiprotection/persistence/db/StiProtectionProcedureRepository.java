/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StiProtectionProcedureRepository
    extends ProcedureRepository<StiProtectionProcedure>,
        JpaSpecificationExecutor<StiProtectionProcedure> {}
