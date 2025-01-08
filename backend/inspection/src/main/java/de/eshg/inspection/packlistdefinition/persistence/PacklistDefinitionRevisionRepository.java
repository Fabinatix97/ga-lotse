/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.persistence;

import de.eshg.inspection.objecttype.persistence.ObjectType;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PacklistDefinitionRevisionRepository
    extends JpaRepository<PacklistDefinitionRevision, UUID> {

  /**
   * Finds the newest packlist definition revisions for a given object type. But exclude those
   * revisions which are part of the provided packlist definition exclusion list.
   *
   * @param objectType The object type to search for
   * @param excludedPacklistDefinitionIds The packlist definition exclusion list
   * @return A list of packlist definition revisions that match the object type and are not part of
   *     provided packlist definitions.
   */
  @Query(
      """
        select r
          from PacklistDefinitionRevision r
          where r.validTo is null
          and :objectType = r.packlistDefinition.objectType
          and r.packlistDefinition.id not in :excludedPacklistDefinitionIds
          order by r.name, r.validFrom desc
        """)
  List<PacklistDefinitionRevision> findNewestPLDRevisionsForObjectTypeWithExclusion(
      @NotNull ObjectType objectType, Set<UUID> excludedPacklistDefinitionIds);
}
