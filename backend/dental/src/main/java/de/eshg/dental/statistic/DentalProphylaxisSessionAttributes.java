/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.FluoridationVarnish;
import de.eshg.dental.domain.model.ProphylaxisType;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import java.util.Arrays;
import java.util.List;

public enum DentalProphylaxisSessionAttributes implements AttributeInfo {
  EINRICHTUNG(
      new ContactIdAttribute(
          "Einrichtung", "EINRICHTUNG", DentalProphylaxisSessionAttributes.CATEGORY, true)),

  SCHULJAHR(
      new IntegerAttribute(
          "Schuljahr der Prophylaxe",
          "SCHULJAHR",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true)),

  GRUPPE(
      new TextAttribute(
          "Name der Gruppe", "GRUPPE", DentalProphylaxisSessionAttributes.CATEGORY, true)),

  TYP(
      new ValueWithOptionsAttribute(
          "Typ der Prophylaxe",
          "TYP",
          getTypeValueOptions(),
          DentalProphylaxisSessionAttributes.CATEGORY,
          true)),

  ANZAHL_KINDER(
      new IntegerAttribute(
          "Anzahl Kinder", "ANZAHL_KINDER", DentalProphylaxisSessionAttributes.CATEGORY, true)),

  REIHENUNTERSUCHUNG(
      new BooleanAttribute(
          "Reihenuntersuchung",
          "REIHENUNTERSUCHUNG",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true)),

  FLUORIDIERUNGSLACK(
      new ValueWithOptionsAttribute(
          "Fluoridierungslack",
          "FLUORIDIERUNGSLACK",
          getFluoridationVarnishValueOptions(),
          DentalProphylaxisSessionAttributes.CATEGORY,
          false));

  static final String CATEGORY = "Prophylaxe";

  private final AttributeData attribute;

  DentalProphylaxisSessionAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }

  private static List<ValueOptionInternal> getTypeValueOptions() {
    return enumToValueOptionList(ProphylaxisType.values());
  }

  private static List<ValueOptionInternal> getFluoridationVarnishValueOptions() {
    return enumToValueOptionList(FluoridationVarnish.values());
  }

  private static <E extends Enum<E>> List<ValueOptionInternal> enumToValueOptionList(E[] values) {
    return Arrays.stream(values)
        .map(value -> new ValueOptionInternal(value.name(), value.name(), false))
        .toList();
  }
}
