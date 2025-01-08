/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(indexes = @Index(columnList = "answer_id"))
public class ReportElementAnswer extends BaseEntityWithExternalId {

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean selected;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String text;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String extraText;

  public boolean isSelected() {
    return selected;
  }

  public void setSelected(boolean selected) {
    this.selected = selected;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getExtraText() {
    return extraText;
  }

  public void setExtraText(String extraText) {
    this.extraText = extraText;
  }
}
