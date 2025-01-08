/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence;

import de.eshg.inspection.objecttype.persistence.ObjectType;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChecklistDefinitionVersionRepository
    extends JpaRepository<ChecklistDefinitionVersion, UUID> {

  /**
   * Finds the newest checklist definition versions for a given object type.
   *
   * @param objectType The object type to search for
   * @return A list of checklist definition versions that match the object type.
   */
  @Query(
      """
          select v
            from ChecklistDefinitionVersion v
            where v.validTo is null
            and v.published = true
            and :objectType member of v.checklistDefinition.objectTypes
            and v.checklistDefinition.deleted = false
            order by v.name, v.validFrom desc
          """)
  List<ChecklistDefinitionVersion> findNewestCLDVersionsForObjectType(
      @NotNull ObjectType objectType);

  /**
   * Finds the newest checklist definition versions for a given object type. But exclude those
   * versions which are part of the provided checklist definition exclusion list.
   *
   * @param objectType The object type to search for
   * @param excludedChecklistDefinitionIds The checklist definition exclusion list
   * @return A list of checklist definition versions that match the object type and are not part of
   *     provided checklist definitions.
   */
  @Query(
      """
          select v
            from ChecklistDefinitionVersion v
            where v.validTo is null
            and v.published = true
            and :objectType member of v.checklistDefinition.objectTypes
            and v.checklistDefinition.id not in :excludedChecklistDefinitionIds
            and v.checklistDefinition.deleted = false
            order by v.name, v.validFrom desc
          """)
  List<ChecklistDefinitionVersion> findNewestCLDVersionsForObjectTypeWithExclusion(
      @NotNull ObjectType objectType, Set<UUID> excludedChecklistDefinitionIds);

  /**
   * Finds the newest core checklist definition versions for a given object type.
   *
   * @param objectType The object type to search for
   * @return A list of core checklist definition versions that match the object type.
   */
  @Query(
      """
          select v
            from ChecklistDefinitionVersion v
            where v.validTo is null
            and v.published = true
            and v.checklistDefinition.isCoreChecklist = true
            and v.checklistDefinition.deleted = false
            and :objectType member of v.checklistDefinition.objectTypes
            order by v.name, v.validFrom desc
          """)
  List<ChecklistDefinitionVersion> findNewestCoreCLDVersionsForObjectType(
      @NotNull ObjectType objectType);
}
