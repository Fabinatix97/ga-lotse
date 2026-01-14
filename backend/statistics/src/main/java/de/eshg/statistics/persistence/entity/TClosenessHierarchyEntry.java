/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(PUBLIC)
@Entity
@Table(indexes = @Index(columnList = "anonymization_configuration_id"))
public class TClosenessHierarchyEntry extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "anonymization_configuration_id")
  private AnonymizationConfiguration anonymizationConfiguration;

  @ElementCollection
  @CollectionTable(name = "t_closeness_hierarchy_steps", joinColumns = @JoinColumn(name = "id"))
  @Column(name = "hierarchy_step", nullable = false)
  @OrderColumn
  private List<String> hierarchySteps = new ArrayList<>();

  public void setAnonymizationConfiguration(AnonymizationConfiguration anonymizationConfiguration) {
    this.anonymizationConfiguration = anonymizationConfiguration;
  }

  public List<String> getHierarchySteps() {
    return hierarchySteps;
  }

  public void setHierarchySteps(List<String> hierarchySteps) {
    this.hierarchySteps.addAll(hierarchySteps);
  }
}
