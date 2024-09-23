/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type")
@DataSensitivity(PUBLIC)
public abstract class ChartConfiguration extends BaseEntity {
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  private Evaluation evaluation;

  void setEvaluation(Evaluation evaluation) {
    this.evaluation = evaluation;
  }
}
