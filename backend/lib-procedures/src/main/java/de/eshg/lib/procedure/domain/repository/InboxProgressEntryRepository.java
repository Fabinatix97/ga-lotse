/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.InboxProgressEntry;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InboxProgressEntryRepository extends JpaRepository<InboxProgressEntry, Long> {

  Optional<InboxProgressEntry> findByExternalId(UUID externalId);

  Optional<InboxProgressEntry> findByExternalIdAndInboxProcedureExternalId(
      UUID externalId, UUID inboxProcedureExternalId);
}
