/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ReportElementType.ElementType.TEXT)
public class ReportElementText extends ReportElement {

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String text;

  @Override
  public ReportElementType getType() {
    return ReportElementType.TEXT;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
