/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ObjectTypeHierarchyTreeNode extends BaseEntity {
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(unique = false, nullable = false)
  @NotNull
  private String name;

  @NotNull
  @ManyToMany(fetch = FetchType.EAGER)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ObjectTypeHierarchyTreeNode> subNodes = new ArrayList<>();

  @NotNull
  @ManyToMany(fetch = FetchType.EAGER)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private final List<ObjectType> objectTypes = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @NotNull
  private boolean rootNode;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer originalIndex;

  public @NotNull String getName() {
    return name;
  }

  public void setName(@NotNull String name) {
    this.name = name;
  }

  public @NotNull List<ObjectTypeHierarchyTreeNode> getSubNodes() {
    return subNodes;
  }

  public void addSubNode(@NotNull ObjectTypeHierarchyTreeNode subNode) {
    this.subNodes.add(subNode);
  }

  public void addSubNode(@NotNull List<ObjectTypeHierarchyTreeNode> subNodes) {
    this.subNodes.addAll(subNodes);
  }

  public @NotNull List<ObjectType> getObjectTypes() {
    return objectTypes;
  }

  public void addObjectType(@NotNull ObjectType objectType) {
    this.objectTypes.add(objectType);
  }

  public void addObjectTypes(@NotNull List<ObjectType> objectTypes) {
    this.objectTypes.addAll(objectTypes);
  }

  @NotNull
  public boolean isRootNode() {
    return rootNode;
  }

  public void setRootNode(@NotNull boolean rootNode) {
    this.rootNode = rootNode;
  }

  public Integer getOriginalIndex() {
    return originalIndex;
  }

  public void setOriginalIndex(Integer originalIndex) {
    this.originalIndex = originalIndex;
  }
}
