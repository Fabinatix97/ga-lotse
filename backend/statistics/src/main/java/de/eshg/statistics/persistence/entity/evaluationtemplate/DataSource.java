/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.evaluationtemplate;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "evaluation_template_id"))
public class DataSource extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "evaluation_template_id")
  private EvaluationTemplate evaluationTemplate;

  @Column(nullable = false)
  private String businessModuleName;

  @Column(nullable = false)
  private UUID externalDataSourceId;

  @Column(nullable = false)
  private String dataSourceName;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataAttribute_.DATA_SOURCE,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataAttribute> attributes = new ArrayList<>();

  void setEvaluationTemplate(EvaluationTemplate evaluationTemplate) {
    this.evaluationTemplate = evaluationTemplate;
  }

  public String getBusinessModuleName() {
    return businessModuleName;
  }

  public void setBusinessModuleName(String businessModuleName) {
    this.businessModuleName = businessModuleName;
  }

  public UUID getExternalDataSourceId() {
    return externalDataSourceId;
  }

  public void setExternalDataSourceId(UUID externalDataSourceId) {
    this.externalDataSourceId = externalDataSourceId;
  }

  public String getDataSourceName() {
    return dataSourceName;
  }

  public void setDataSourceName(String dataSourceName) {
    this.dataSourceName = dataSourceName;
  }

  public List<DataAttribute> getAttributes() {
    return attributes;
  }

  public void addAttributes(List<DataAttribute> attributes) {
    attributes.forEach(attribute -> attribute.setDataSource(this));
    this.attributes.addAll(attributes);
  }
}
