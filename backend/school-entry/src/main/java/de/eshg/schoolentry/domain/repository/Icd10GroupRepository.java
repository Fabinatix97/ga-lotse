/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.schoolentry.domain.model.Icd10Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface Icd10GroupRepository extends JpaRepository<Icd10Group, String> {

  @Query(
      "select count(*)>0 from Icd10Group g where g.groupStart || '-' || g.groupEnd in :groupCode")
  boolean existsByGroupStartAndGroupEnd(String groupCode);
}
