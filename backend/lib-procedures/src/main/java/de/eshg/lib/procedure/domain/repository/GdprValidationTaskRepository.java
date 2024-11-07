/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GdprValidationTaskRepository
    extends JpaRepository<GdprValidationTask, Long>, JpaSpecificationExecutor<GdprValidationTask> {

  Optional<GdprValidationTask> findByProcedureId(UUID procedureId);
}
