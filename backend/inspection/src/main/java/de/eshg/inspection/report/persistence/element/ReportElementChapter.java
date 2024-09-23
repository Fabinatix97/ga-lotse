/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ReportElementType.ElementType.CHAPTER)
public class ReportElementChapter extends ReportElement {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Override
  public ReportElementType getType() {
    return ReportElementType.CHAPTER;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
