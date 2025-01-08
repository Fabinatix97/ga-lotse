/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
  Optional<MediaFile> findByFileExternalId(UUID externalId);

  List<MediaFile> findAllByFileExternalIdInOrderById(List<UUID> externalIds);
}
