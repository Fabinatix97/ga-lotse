/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.inspection.objecttype.persistence.ObjectTypeHierarchyReader.JsonTreeNode;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CreateObjectTypeHierarchyTask {

  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository;
  private final ObjectTypeProperties objectTypeProperties;
  private final TransactionHelper transactionHelper;
  private final ObjectTypeHierarchyReader objectTypeHierarchyReader;
  private final CreateObjectTypeTask createObjectTypeTask;

  public CreateObjectTypeHierarchyTask(
      ObjectTypeRepository objectTypeRepository,
      ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository,
      ObjectTypeProperties objectTypeProperties,
      TransactionHelper transactionHelper,
      ObjectTypeHierarchyReader objectTypeHierarchyReader,
      CreateObjectTypeTask createObjectTypeTask) {
    this.objectTypeHierarchyTreeNodeRepository = objectTypeHierarchyTreeNodeRepository;
    this.objectTypeHierarchyReader = objectTypeHierarchyReader;
    this.createObjectTypeTask = createObjectTypeTask;
    this.objectTypeRepository = objectTypeRepository;
    this.objectTypeProperties = objectTypeProperties;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createObjectTypeHierarchy() {
    // This creates the legacy object types, if necessary.
    createObjectTypeTask.createObjectTypes();

    transactionHelper.executeInTransaction(
        () -> {
          // If the root node is present, we assume that this already ran and we shouldn't do it
          // again.
          // If we ever need to import an updated version, we need to think about how to do a
          // migration.
          if (objectTypeHierarchyTreeNodeRepository.findByRootNode(true).isEmpty()) {
            List<ObjectType> legacyObjectTypes = objectTypeRepository.findAll();

            toDatabaseTreeNode(objectTypeHierarchyReader.getRootNode(), true, legacyObjectTypes);
          }
        });
  }

  private ObjectTypeHierarchyTreeNode toDatabaseTreeNode(
      JsonTreeNode jsonTreeNode, boolean isRoot, List<ObjectType> legacyObjectTypes) {
    ObjectTypeHierarchyTreeNode treeNode = new ObjectTypeHierarchyTreeNode();
    treeNode.setName(jsonTreeNode.name());
    treeNode.setOriginalIndex(jsonTreeNode.originalIndex());
    treeNode.setRootNode(isRoot);
    List<JsonTreeNode> objectTypes =
        jsonTreeNode.children().stream()
            .filter(n -> n.children() == null || n.children().isEmpty())
            .toList();
    List<JsonTreeNode> childNodes =
        jsonTreeNode.children().stream()
            .filter(n -> n.children() != null && !n.children().isEmpty())
            .toList();
    treeNode.addObjectTypes(objectTypes.stream().map(this::toObjectType).toList());
    treeNode.addSubNode(
        childNodes.stream()
            .map(n -> toDatabaseTreeNode(n, false, Collections.emptyList()))
            .toList());

    if (isRoot) {
      ObjectTypeHierarchyTreeNode legacyNode = new ObjectTypeHierarchyTreeNode();
      legacyNode.setName("Andere");
      legacyNode.setRootNode(false);
      legacyNode.addObjectTypes(legacyObjectTypes);
      objectTypeHierarchyTreeNodeRepository.save(legacyNode);
      treeNode.addSubNode(legacyNode);
    }

    objectTypeHierarchyTreeNodeRepository.save(treeNode);

    return treeNode;
  }

  private ObjectType toObjectType(JsonTreeNode jsonTreeNode) {
    ObjectType objectType = new ObjectType();
    objectType.setName(jsonTreeNode.name());
    objectType.setRoutineInterval(this.objectTypeProperties.routineInterval());
    objectType.setComplaintInterval(this.objectTypeProperties.complaintInterval());
    objectType.setStandardDuration(this.objectTypeProperties.standardDuration());
    objectType.setStandardBufferTime(this.objectTypeProperties.standardBufferTime());
    objectType.setOriginalIndex(jsonTreeNode.originalIndex());
    objectTypeRepository.save(objectType);
    return objectType;
  }
}
