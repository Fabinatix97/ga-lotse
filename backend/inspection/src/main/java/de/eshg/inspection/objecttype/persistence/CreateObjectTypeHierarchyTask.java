/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class CreateObjectTypeHierarchyTask {

  public static final String HIERARCHY_JSON_FILE =
      "/de/eshg/inspection/objecttype/objectTypeHierarchy.json";

  private final ClassPathResource hierarchyJsonFile;
  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository;
  private final ObjectTypeProperties objectTypeProperties;
  private final TransactionHelper transactionHelper;
  private final ObjectMapper objectMapper;
  private final CreateObjectTypeTask createObjectTypeTask;
  private final InspectionFeatureToggle inspectionFeatureToggle;

  public CreateObjectTypeHierarchyTask(
      @Value(HIERARCHY_JSON_FILE) ClassPathResource hierarchyJsonFile,
      ObjectTypeRepository objectTypeRepository,
      ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository,
      ObjectTypeProperties objectTypeProperties,
      TransactionHelper transactionHelper,
      ObjectMapper objectMapper,
      CreateObjectTypeTask createObjectTypeTask,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.objectTypeHierarchyTreeNodeRepository = objectTypeHierarchyTreeNodeRepository;
    this.objectMapper = objectMapper;
    this.createObjectTypeTask = createObjectTypeTask;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    Assert.isTrue(hierarchyJsonFile.exists(), hierarchyJsonFile + " does not exist");
    this.hierarchyJsonFile = hierarchyJsonFile;
    this.objectTypeRepository = objectTypeRepository;
    this.objectTypeProperties = objectTypeProperties;
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createObjectTypeHierarchy() {
    // This creates the legacy object types, if necessary.
    createObjectTypeTask.createObjectTypes();

    if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY))
      transactionHelper.executeInTransaction(
          () -> {
            // If the root node is present, we assume that this already ran and we shouldn't do it
            // again.
            // If we ever need to import an updated version, we need to think about how to do a
            // migration.
            if (objectTypeHierarchyTreeNodeRepository.findByRootNode(true).isEmpty()) {
              List<ObjectType> legacyObjectTypes = objectTypeRepository.findAll();

              JsonTreeNode root =
                  objectMapper.readValue(hierarchyJsonFile.getInputStream(), JsonTreeNode.class);

              toDatabaseTreeNode(root, true, legacyObjectTypes);
            }
          });
  }

  private ObjectTypeHierarchyTreeNode toDatabaseTreeNode(
      JsonTreeNode jsonTreeNode, boolean isRoot, List<ObjectType> legacyObjectTypes) {
    ObjectTypeHierarchyTreeNode treeNode = new ObjectTypeHierarchyTreeNode();
    treeNode.setName(jsonTreeNode.name);
    treeNode.setOriginalIndex(jsonTreeNode.originalIndex);
    treeNode.setRootNode(isRoot);
    List<JsonTreeNode> objectTypes =
        jsonTreeNode.children.stream()
            .filter(n -> n.children() == null || n.children().isEmpty())
            .toList();
    List<JsonTreeNode> childNodes =
        jsonTreeNode.children.stream()
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
    objectType.setName(jsonTreeNode.name);
    objectType.setRoutineInterval(this.objectTypeProperties.routineInterval());
    objectType.setComplaintInterval(this.objectTypeProperties.complaintInterval());
    objectType.setStandardDuration(this.objectTypeProperties.standardDuration());
    objectType.setStandardBufferTime(this.objectTypeProperties.standardBufferTime());
    objectType.setOriginalIndex(jsonTreeNode.originalIndex);
    objectTypeRepository.save(objectType);
    return objectType;
  }

  record JsonTreeNode(String name, Integer originalIndex, List<JsonTreeNode> children) {}
}
