/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.schoolentry.api.DocumentTypes;
import de.eshg.schoolentry.domain.model.SchoolEntryConfig;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolEntryConfigRepository extends JpaRepository<SchoolEntryConfig, Long> {
  @Query(
      """
        SELECT dt
        FROM SchoolEntryConfig e
        JOIN e.documentsWithEmployeeInfo dt
        WHERE e.id = :id
    """)
  Set<DocumentTypes> findDocumentTypesByConfigId(@Param("id") Long id);
}
