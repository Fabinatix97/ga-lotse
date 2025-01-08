/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.Diagram;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DataSensitivity(SENSITIVE)
public abstract class DiagramData extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  private Diagram diagram;

  @Column(nullable = false)
  private int evaluatedDataAmount;

  public Diagram getDiagram() {
    return diagram;
  }

  public void setDiagram(Diagram diagram) {
    this.diagram = diagram;
  }

  public int getEvaluatedDataAmount() {
    return evaluatedDataAmount;
  }

  public void setEvaluatedDataAmount(int evaluatedDataAmount) {
    this.evaluatedDataAmount = evaluatedDataAmount;
  }
}
