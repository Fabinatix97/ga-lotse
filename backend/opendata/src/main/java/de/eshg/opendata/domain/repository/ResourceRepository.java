/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.domain.repository;

import de.eshg.opendata.domain.model.Resource;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository
    extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

  @Query(
      """
    SELECT r FROM Resource r
    JOIN FETCH r.versions v
    WHERE r.resourceName = :resourceName
    ORDER BY v.publicationDate DESC
    """)
  Optional<Resource> findByResourceNameFetchingVersions(@Param("resourceName") String resourceName);

  @Query(
      """
    SELECT DISTINCT r FROM Resource r
    JOIN FETCH r.versions v
    WHERE LOWER(v.fileName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
    OR LOWER(v.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
    OR LOWER(v.versionName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
    ORDER BY v.publicationDate DESC
    """)
  List<Resource> findByResourceNameOrVersionNameOrDescription(
      @Param("searchTerm") String searchTerm);
}
