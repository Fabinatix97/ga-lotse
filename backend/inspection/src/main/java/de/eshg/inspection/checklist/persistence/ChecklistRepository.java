/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ChecklistRepository extends JpaRepository<Checklist, UUID> {

  // This should only ever be used by the test helper! This can be useful for easily testing a
  // corrupted checklist, or writing e2e tests with corrupted checklists.
  @Modifying
  @Query(value = "update checklist set hash_value = 'CORRUPT'", nativeQuery = true)
  void makeChecklistsCorruptForTestHelper();
}
