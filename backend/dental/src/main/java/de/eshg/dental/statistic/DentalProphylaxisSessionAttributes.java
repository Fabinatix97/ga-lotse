/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.FluoridationVarnish;
import de.eshg.dental.domain.model.ProphylaxisType;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import java.util.Arrays;
import java.util.List;

public enum DentalProphylaxisSessionAttributes implements AttributeInfo {
  EINRICHTUNG(
      ContactIdAttribute.create(
          "Einrichtung", "EINRICHTUNG", DentalProphylaxisSessionAttributes.CATEGORY, true)),

  SCHULJAHR(
      IntegerAttribute.createQuasiIdentifying(
          "Schuljahr der Maßnahme",
          "SCHULJAHR",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true,
          null,
          null,
          new IntegerMinMaxCountIntervalConfiguration(1990, 2100, 111))),

  GRUPPE(
      TextAttribute.create(
          "Name der Gruppe",
          "GRUPPE",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  TYP(
      ValueWithOptionsAttribute.create(
          "Typ der Maßnahme",
          "TYP",
          DentalProphylaxisSessionAttributes.CATEGORY,
          false,
          getTypeValueOptions(),
          DataPrivacyCategory.INSENSITIVE)),

  ANZAHL_KINDER(
      IntegerAttribute.createInsensitive(
          "Anzahl Kinder",
          "ANZAHL_KINDER",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true,
          null,
          null)),

  REIHENUNTERSUCHUNG(
      BooleanAttribute.createSensitive(
          "Reihenuntersuchung",
          "REIHENUNTERSUCHUNG",
          DentalProphylaxisSessionAttributes.CATEGORY,
          true,
          0.2)),

  FLUORIDIERUNGSLACK(
      ValueWithOptionsAttribute.createSensitive(
          "Fluoridierungslack",
          "FLUORIDIERUNGSLACK",
          DentalProphylaxisSessionAttributes.CATEGORY,
          false,
          getFluoridationVarnishValueOptions(),
          new SensitiveParameters(null, 0.2),
          null));

  static final String CATEGORY = "Maßnahme";

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
