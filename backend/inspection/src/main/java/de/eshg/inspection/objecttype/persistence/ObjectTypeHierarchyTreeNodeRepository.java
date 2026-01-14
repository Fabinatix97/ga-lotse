/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObjectTypeHierarchyTreeNodeRepository
    extends JpaRepository<ObjectTypeHierarchyTreeNode, UUID> {
  Optional<ObjectTypeHierarchyTreeNode> findByRootNode(boolean rootNode);
}
