/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue(value = ReportElementType.ElementType.QUESTION_AND_ANSWERS)
public class ReportElementQA extends ReportElement {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @OneToMany(
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @JoinColumn(name = "answer_id", nullable = false)
  @Size(min = 1)
  @OrderColumn
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<ReportElementAnswer> answers = new ArrayList<>();

  @Override
  public ReportElementType getType() {
    return ReportElementType.QUESTION_AND_ANSWERS;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public List<ReportElementAnswer> getAnswers() {
    return answers;
  }
}
