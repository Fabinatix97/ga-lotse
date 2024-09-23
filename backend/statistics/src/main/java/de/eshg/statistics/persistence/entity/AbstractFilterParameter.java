/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type")
@DataSensitivity(PUBLIC)
@Table(indexes = {@Index(columnList = "diagram_id"), @Index(columnList = "filter_template_id")})
public abstract class AbstractFilterParameter extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "diagram_id")
  private Diagram diagram;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "filter_template_id")
  private FilterTemplate filterTemplate;

  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private AttributeSelection attributeSelection;

  void setDiagram(Diagram diagram) {
    this.diagram = diagram;
  }

  public void setFilterTemplate(FilterTemplate filterTemplate) {
    this.filterTemplate = filterTemplate;
  }

  public AttributeSelection getAttributeSelection() {
    return attributeSelection;
  }

  public void setAttributeSelection(AttributeSelection attributeSelection) {
    this.attributeSelection = attributeSelection;
  }
}
