/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.icd10.persistence.repository;

import de.eshg.base.icd10.persistence.entity.Icd10Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface Icd10GroupRepository extends JpaRepository<Icd10Group, String> {

  @Query(
      "select count(*)>0 from Icd10Group g where g.groupStart || '-' || g.groupEnd in :groupCode")
  boolean existsByGroupStartAndGroupEnd(String groupCode);
}
