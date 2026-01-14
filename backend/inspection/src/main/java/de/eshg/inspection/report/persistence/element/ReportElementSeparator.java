/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue(value = ReportElementType.ElementType.SEPARATOR)
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class ReportElementSeparator extends ReportElement {

  @Override
  public ReportElementType getType() {
    return ReportElementType.SEPARATOR;
  }
}
