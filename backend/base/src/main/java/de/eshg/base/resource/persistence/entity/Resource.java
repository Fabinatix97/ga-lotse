/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.persistence.entity;

import de.eshg.base.label.persistence.entity.Label;
import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class Resource extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String name;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private ResourceType type;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "resource_label",
      joinColumns = {@JoinColumn(name = "resource_id")},
      inverseJoinColumns = {@JoinColumn(name = "label_id")})
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Set<Label> labels = new LinkedHashSet<>();

  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String articleNumber;

  @DataSensitivity(value = SensitivityLevel.PROTECTED)
  private String description;

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

  public ResourceType getType() {
    return type;
  }

  public void setType(ResourceType type) {
    this.type = type;
  }

  public Set<Label> getLabels() {
    return labels;
  }

  public void setLabels(Set<Label> labels) {
    this.labels = labels;
  }
}
