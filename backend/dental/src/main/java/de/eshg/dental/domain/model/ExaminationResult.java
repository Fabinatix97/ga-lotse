/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToOne;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DataSensitivity(SensitivityLevel.SENSITIVE)
public abstract class ExaminationResult extends BaseEntity {

  @OneToOne(optional = false, mappedBy = Examination_.RESULT)
  private Examination examination;

  private boolean fluorideVarnishApplied;

  public Examination getExamination() {
    return examination;
  }

  public void setExamination(Examination examination) {
    this.examination = examination;
  }

  public boolean isFluorideVarnishApplied() {
    return fluorideVarnishApplied;
  }

  public void setFluorideVarnishApplied(boolean fluorideVarnishApplied) {
    this.fluorideVarnishApplied = fluorideVarnishApplied;
  }
}
