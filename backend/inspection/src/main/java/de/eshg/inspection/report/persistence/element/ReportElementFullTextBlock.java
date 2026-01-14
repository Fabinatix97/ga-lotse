/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.inspection.report.persistence.element.ReportElementType.ElementType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ElementType.FULL_TEXT_BLOCK)
@DataSensitivity(SensitivityLevel.PROTECTED)
public class ReportElementFullTextBlock extends ReportElement {

  private String title;

  private String text;

  @Override
  public ReportElementType getType() {
    return ReportElementType.FULL_TEXT_BLOCK;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
