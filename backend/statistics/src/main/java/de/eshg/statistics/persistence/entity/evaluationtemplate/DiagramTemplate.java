/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.evaluationtemplate;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter_;
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

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "analysis_template_id"))
public class DiagramTemplate extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "analysis_template_id")
  private AnalysisTemplate analysisTemplate;

  @Column(nullable = false)
  private String title;

  @Column private String description;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = AbstractFilterParameter_.DIAGRAM_TEMPLATE,
      orphanRemoval = true)
  @OrderColumn
  private final List<AbstractFilterParameter> filters = new ArrayList<>();

  public void setAnalysisTemplate(AnalysisTemplate analysisTemplate) {
    this.analysisTemplate = analysisTemplate;
  }

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

  public List<AbstractFilterParameter> getFilters() {
    return filters;
  }

  public void addFilters(List<AbstractFilterParameter> filters) {
    filters.forEach(filter -> filter.setDiagramTemplate(this));
    this.filters.addAll(filters);
  }
}
