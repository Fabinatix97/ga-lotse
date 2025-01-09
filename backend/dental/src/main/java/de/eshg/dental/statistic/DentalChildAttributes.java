/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.dental.statistic.model.Group;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;

public enum DentalChildAttributes implements AttributeInfo {
  PROCEDURE_ID(
      new ProcedureAttribute(
          "Vorgangsreferenz", DentalChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      new CentralFileIdPersonAttribute(
          "Kind", "CHILD_CENTRAL_FILE_ID", DentalChildAttributes.CATEGORY_CHILD, true)),

  CHILD_GROUP(
      new ValueWithOptionsAttribute(
          "Gruppe",
          "CHILD_GROUP",
          convertToValueOptions(Group.values()),
          DentalChildAttributes.CATEGORY_CHILD,
          true)),
  ;

  static final String CATEGORY_CHILD = "Kind";
  static final String CATEGORY_PROCEDURE_REFERENCE = "Vorgangsreferenz";

  private final AttributeData attribute;

  DentalChildAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
