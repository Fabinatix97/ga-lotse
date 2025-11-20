/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TeisUntersuchungsparameterRepository
    extends JpaRepository<TeisUntersuchungsparameter, String> {

  Optional<TeisUntersuchungsparameter> findTeisUntersuchungsparameterByZid(String zid);

  @Query(
      """
            select u
            from TeisUntersuchungsparameter u
            join TeisParameter p on u.parameter = p
            where p.bezeichnung like :prefix
            order by p.bezeichnung asc, u.zid
            limit :limit
            """)
  List<TeisUntersuchungsparameter> findAutocomplete(String prefix, int limit);
}
