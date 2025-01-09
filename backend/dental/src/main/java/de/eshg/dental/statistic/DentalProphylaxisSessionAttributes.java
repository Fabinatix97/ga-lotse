/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;

public enum DentalProphylaxisSessionAttributes implements AttributeInfo {
  INSTITUTION_ID(
      new TextAttribute(
          "ID der Einrichtung",
          "INSTITUTION_ID",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true)),

  SCHOOL_YEAR(
      new IntegerAttribute(
          "Schuljahr der Untersuchung",
          "SCHOOL_YEAR",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true)),

  GROUP_NAME(
      new TextAttribute(
          "Name der Gruppe", "GROUP_NAME", DentalProphylaxisSessionAttributes.CATEGORY, true)),
  ;

  static final String CATEGORY = "Prophylaxe";

  private final AttributeData attribute;

  DentalProphylaxisSessionAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
