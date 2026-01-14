/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.persistence.repository;

import de.eshg.centralrepository.persistence.entity.IdVersionPK;
import de.eshg.centralrepository.persistence.entity.VersionedEntryContent;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersionedEntryContentRepository
    extends JpaRepository<VersionedEntryContent, Long> {
  VersionedEntryContent findFirstByMetadataPk(IdVersionPK pk);

  int deleteAllByMetadataDeletedAtIsLessThan(Instant deletedAt);
}
