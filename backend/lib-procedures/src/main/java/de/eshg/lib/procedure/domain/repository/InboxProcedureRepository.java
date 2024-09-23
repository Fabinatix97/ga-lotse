/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.domain.model.view.IdView;
import de.eshg.lib.procedure.domain.model.view.InboxProcedureProgressEntryView;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InboxProcedureRepository
    extends JpaRepository<InboxProcedure, Long>, JpaSpecificationExecutor<InboxProcedure> {

  Optional<InboxProcedure> findByExternalId(UUID externalId);

  List<InboxProcedureProgressEntryView> findByIdIsIn(Collection<Long> ids);

  List<IdView> findByClosedAtBefore(Instant instant);
}
