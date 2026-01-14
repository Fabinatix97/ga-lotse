/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuAnamnesisAttributes implements EsuAttributes {
  KT(
      ValueWithOptionsAttribute.createSensitive(
          "Krippe + KT-Besuch  nach Monaten gruppiert",
          "KT",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Daycare.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KISS(
      BooleanAttribute.createSensitive(
          "KiSS", "KISS", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  VLK(
      BooleanAttribute.createSensitive(
          "Vorlaufkurs", "VLK", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),
  GG(
      ValueWithOptionsAttribute.createSensitive(
          "Geburtsgewicht",
          "GG",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BirthWeight.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  SSW_DAUER(
      BooleanAttribute.createSensitive(
          "Schwangerschaftsdauer regelrecht",
          "SSW_DAUER",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          false,
          0.2)),

  U2E(
      ValueWithOptionsAttribute.createSensitive(
          "U2",
          "U2E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U3E(
      ValueWithOptionsAttribute.createSensitive(
          "U3",
          "U3E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U4E(
      ValueWithOptionsAttribute.createSensitive(
          "U4",
          "U4E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U5E(
      ValueWithOptionsAttribute.createSensitive(
          "U5",
          "U5E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U6E(
      ValueWithOptionsAttribute.createSensitive(
          "U6",
          "U6E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U7E(
      ValueWithOptionsAttribute.createSensitive(
          "U7",
          "U7E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U7A(
      ValueWithOptionsAttribute.createSensitive(
          "U7a",
          "U7A",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U8E(
      ValueWithOptionsAttribute.createSensitive(
          "U8",
          "U8E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  U9E(
      ValueWithOptionsAttribute.createSensitive(
          "U9",
          "U9E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  FF(
      BooleanAttribute.createSensitive(
          "Frühförderung", "FF", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  IP(
      BooleanAttribute.createSensitive(
          "Integrationsplatz", "IP", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  ERGO(
      BooleanAttribute.createSensitive(
          "Ergotherapie", "ERGO", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  LOGO(
      BooleanAttribute.createSensitive(
          "Logopädie - Sprachtherapie",
          "LOGO",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          0.2)),

  KG(
      BooleanAttribute.createSensitive(
          "Krankengymnastik", "KG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  MIG(
      BooleanAttribute.createSensitive(
          "Migrationshintergrund", "MIG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true, 0.2)),

  GEBKI_TEXT(
      TextAttribute.create(
          "Geburtsland Kind",
          "GEBKI_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBKI_LKZ(
      TextAttribute.create(
          "Geburtsland Kind LKZ",
          "GEBKI_LKZ",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBKI(
      ValueWithOptionsAttribute.createSensitive(
          "Geburtsland Kind gruppiert",
          "GEBKI",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null)),

  STAKI_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Kind",
          "STAKI_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAKI_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Kind LKZ",
          "STAKI_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAKI(
      ValueWithOptionsAttribute.createSensitive(
          "Staatsangehörigkeit Kind gruppiert",
          "STAKI",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null)),

  GEBET1_TEXT(
      TextAttribute.create(
          "Geburtsland des Elternteil 1",
          "GEBET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBET1_FFM(
      TextAttribute.create(
          "Geburtsland des Elternteil 1 LKZ",
          "GEBET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBET1(
      ValueWithOptionsAttribute.createSensitive(
          "Geburtsland des Elternteil 1 gruppiert",
          "GEBET1",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null)),

  STAET1_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 1",
          "STAET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAET1_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 1 LKZ",
          "STAET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAET1(
      ValueWithOptionsAttribute.createSensitive(
          "Staatsangehörigkeit Elternteil 1 gruppiert",
          "STAET1",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null)),

  GEBET2_TEXT(
      TextAttribute.create(
          "Geburtsland des Elternteil 2",
          "GEBET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBET2_FFM(
      TextAttribute.create(
          "Geburtsland des Elternteil 2 LKZ",
          "GEBET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  GEBET2(
      ValueWithOptionsAttribute.createSensitive(
          "Geburtsland des Elternteil 2 gruppiert",
          "GEBET2",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null)),

  STAET2_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 2",
          "STAET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAET2_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 2 LKZ",
          "STAET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  STAET2(
      ValueWithOptionsAttribute.createSensitive(
          "Staatsangehörigkeit Elternteil 2 gruppiert",
          "STAET2",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()),
          new SensitiveParameters(2, null),
          null));

  private static final String CATEGORY_ANAMNESIS = "Anamnese";

  private final AttributeData attribute;

  EsuAnamnesisAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
