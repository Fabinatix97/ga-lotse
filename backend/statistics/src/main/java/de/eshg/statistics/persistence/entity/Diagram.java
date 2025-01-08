/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;
import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(indexes = @Index(columnList = "analysis_id"))
public class Diagram extends BaseEntityWithExternalId {
  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String title;

  @DataSensitivity(PUBLIC)
  @Column
  private String description;

  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "analysis_id")
  private Analysis analysis;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = AbstractFilterParameter_.DIAGRAM,
      orphanRemoval = true)
  @OrderColumn
  private final List<AbstractFilterParameter> filters = new ArrayList<>();

  @DataSensitivity(SENSITIVE)
  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DiagramData_.DIAGRAM,
      optional = false,
      orphanRemoval = true)
  private DiagramData diagramData;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  void setAnalysis(Analysis analysis) {
    this.analysis = analysis;
  }

  public Analysis getAnalysis() {
    return analysis;
  }

  public List<AbstractFilterParameter> getFilters() {
    return filters;
  }

  public void addFilters(List<AbstractFilterParameter> filters) {
    filters.forEach(filter -> filter.setDiagram(this));
    this.filters.addAll(filters);
  }

  public DiagramData getDiagramData() {
    return diagramData;
  }

  public void setDiagramData(DiagramData diagramData) {
    diagramData.setDiagram(this);
    this.diagramData = diagramData;
  }
}
