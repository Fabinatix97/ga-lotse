/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.persistence;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

public interface WebSearchRepository extends JpaRepository<WebSearch, UUID> {
  List<WebSearch> findAllByStatusIn(WebSearchStatus... status);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<WebSearch> findAndLockById(UUID id);
}
