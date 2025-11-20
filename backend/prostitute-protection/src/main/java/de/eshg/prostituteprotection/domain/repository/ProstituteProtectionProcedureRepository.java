/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.repository;

import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProstituteProtectionProcedureRepository
    extends ProcedureRepository<ProstituteProtectionProcedure>,
        JpaSpecificationExecutor<ProstituteProtectionProcedure> {}
