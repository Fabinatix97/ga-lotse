/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import static de.eshg.inspection.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_FACILITY;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import java.util.ArrayList;

public enum FacilityAttributes implements AttributeInfo {
  CENTRAL_FILE_ID(
      new CentralFileIdFacilityAttribute(
          "Einrichtung", "CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_FACILITY, true)),

  OBJECT_TYPE(
      new ValueWithOptionsAttribute(
          "Objekttyp", "OBJECT_TYPE", new ArrayList<>(), ATTRIBUTE_CATEGORY_FACILITY, false)),

  COMPLAINED_ABOUT(
      new BooleanAttribute("Beanstandet", "COMPLAINED_ABOUT", ATTRIBUTE_CATEGORY_FACILITY, true)),

  BANNED(new BooleanAttribute("Untersagt", "BANNED", ATTRIBUTE_CATEGORY_FACILITY, true)),

  INSPECTED(new BooleanAttribute("Begangen", "INSPECTED", ATTRIBUTE_CATEGORY_FACILITY, true)),
  ;

  private final AttributeData attribute;

  FacilityAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
