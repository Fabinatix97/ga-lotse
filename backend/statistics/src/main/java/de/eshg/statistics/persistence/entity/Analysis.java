/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "aggregation_result_id"))
public class Analysis extends BaseEntityWithExternalId {
  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "aggregation_result_id")
  private AbstractAggregationResult aggregationResult;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(PUBLIC)
  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private ChartConfiguration chartConfiguration;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = Diagram_.ANALYSIS,
      orphanRemoval = true)
  @OrderBy
  private final List<Diagram> diagrams = new ArrayList<>();

  public AbstractAggregationResult getAggregationResult() {
    return aggregationResult;
  }

  void setAggregationResult(AbstractAggregationResult aggregationResult) {
    this.aggregationResult = aggregationResult;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public ChartConfiguration getChartConfiguration() {
    return chartConfiguration;
  }

  public void setChartConfiguration(ChartConfiguration chartConfiguration) {
    this.chartConfiguration = chartConfiguration;
  }

  public void addDiagram(Diagram diagram) {
    diagram.setAnalysis(this);
    diagrams.add(diagram);
  }

  public void addDiagrams(Collection<Diagram> diagrams) {
    diagrams.forEach(this::addDiagram);
  }

  public List<Diagram> getDiagrams() {
    return diagrams;
  }

  public void removeDiagrams() {
    this.diagrams.forEach(diagram -> diagram.setAnalysis(null));
    this.diagrams.clear();
  }
}
