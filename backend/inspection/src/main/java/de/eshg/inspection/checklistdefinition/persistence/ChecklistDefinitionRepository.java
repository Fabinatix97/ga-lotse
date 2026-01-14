/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChecklistDefinitionRepository extends JpaRepository<ChecklistDefinition, UUID> {
  List<ChecklistDefinition> findAllByRepositoryIdIn(List<Long> repositoryIds);

  Optional<ChecklistDefinition> findByRepositoryId(Long repositoryId);
}
