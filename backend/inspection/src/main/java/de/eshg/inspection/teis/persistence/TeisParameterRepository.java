/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TeisParameterRepository extends JpaRepository<TeisParameter, String> {

  Optional<TeisParameter> findTeisParameterByZid(String zid);

  @Query(
      """
          select p
          from TeisParameter p
          where lower(p.bezeichnung) like :prefix
          order by p.bezeichnung asc, p.zid
          limit :limit
          """)
  List<TeisParameter> findAutocomplete(String prefix, int limit);
}
