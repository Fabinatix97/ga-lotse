/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.evaluationtemplate;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class EvaluationTemplate extends BaseEntityWithExternalId {

  @DataSensitivity(PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(PROTECTED)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdByUserId;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(PUBLIC)
  @Column
  private String description;

  @DataSensitivity(PROTECTED)
  @Column
  private Instant lastUsageAt;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataSource_.EVALUATION_TEMPLATE,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataSource> dataSources = new ArrayList<>();

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = AnalysisTemplate_.EVALUATION_TEMPLATE,
      orphanRemoval = true)
  @OrderBy
  private final List<AnalysisTemplate> analysisTemplates = new ArrayList<>();

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private int analysisCount = 0;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public UUID getCreatedByUserId() {
    return createdByUserId;
  }

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

  public Instant getLastUsageAt() {
    return lastUsageAt;
  }

  public void setLastUsageAt(Instant lastUsageAt) {
    this.lastUsageAt = lastUsageAt;
  }

  public List<DataSource> getDataSources() {
    return dataSources;
  }

  public void addDataSources(List<DataSource> dataSources) {
    dataSources.forEach(dataSource -> dataSource.setEvaluationTemplate(this));
    this.dataSources.addAll(dataSources);
  }

  public List<AnalysisTemplate> getAnalysisTemplates() {
    return analysisTemplates;
  }

  public void addAnalysisTemplates(List<AnalysisTemplate> analysisTemplates) {
    analysisTemplates.forEach(analysisTemplate -> analysisTemplate.setEvaluationTemplate(this));
    this.analysisTemplates.addAll(analysisTemplates);
    this.analysisCount = this.analysisTemplates.size();
  }

  public int getAnalysisCount() {
    return analysisCount;
  }
}
