/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.persistence.entity;

import de.eshg.base.label.persistence.entity.Label;
import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InventoryItem extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String name;

  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String description;

  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String articleNumber;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private InventoryItemType type;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "inventoryItem_label",
      joinColumns = {@JoinColumn(name = "inventoryItem_id")},
      inverseJoinColumns = {@JoinColumn(name = "label_id")})
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Set<Label> labels = new LinkedHashSet<>();

  @Min(0)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private int count;

  @Min(0)
  @DataSensitivity(value = SensitivityLevel.PSEUDONYMIZED)
  private int minCount;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getArticleNumber() {
    return articleNumber;
  }

  public void setArticleNumber(String articleNumber) {
    this.articleNumber = articleNumber;
  }

  public InventoryItemType getType() {
    return type;
  }

  public void setType(InventoryItemType type) {
    this.type = type;
  }

  public Set<Label> getLabels() {
    return labels;
  }

  public void setLabels(Set<Label> labels) {
    this.labels = labels;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  public int getMinCount() {
    return minCount;
  }

  public void setMinCount(int minCount) {
    this.minCount = minCount;
  }
}
