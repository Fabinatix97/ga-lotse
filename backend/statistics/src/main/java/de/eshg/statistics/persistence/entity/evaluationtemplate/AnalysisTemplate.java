/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.evaluationtemplate;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "evaluation_template_id"))
public class AnalysisTemplate extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "evaluation_template_id")
  private EvaluationTemplate evaluationTemplate;

  @Column(nullable = false)
  private String name;

  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private ChartConfiguration chartConfiguration;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DiagramTemplate_.ANALYSIS_TEMPLATE,
      orphanRemoval = true)
  @OrderBy
  private final List<DiagramTemplate> diagramTemplates = new ArrayList<>();

  public void setEvaluationTemplate(EvaluationTemplate evaluationTemplate) {
    this.evaluationTemplate = evaluationTemplate;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public ChartConfiguration getChartConfiguration() {
    return chartConfiguration;
  }

  public void setChartConfiguration(ChartConfiguration chartConfiguration) {
    this.chartConfiguration = chartConfiguration;
  }

  public List<DiagramTemplate> getDiagramTemplates() {
    return diagramTemplates;
  }

  public void addDiagramTemplates(List<DiagramTemplate> diagramTemplates) {
    diagramTemplates.forEach(diagramTemplate -> diagramTemplate.setAnalysisTemplate(this));
    this.diagramTemplates.addAll(diagramTemplates);
  }
}
