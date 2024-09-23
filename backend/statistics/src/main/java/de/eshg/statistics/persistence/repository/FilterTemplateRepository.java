/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.FilterTemplate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FilterTemplateRepository extends JpaRepository<FilterTemplate, Long> {

  Optional<FilterTemplate> findByExternalId(UUID externalId);

  Optional<FilterTemplate> findByName(String name);

  @Query(
      """
       select ft from FilterTemplate ft
       where not exists (
        select param from AbstractFilterParameter param
        where param.filterTemplate = ft
        and param.attributeSelection.searchKey not in :searchKeys
       )
       order by ft.id desc
    """)
  List<FilterTemplate> findFilterTemplatesWithAllSearchKeysIn(
      @Param("searchKeys") List<String> searchKeys);
}
