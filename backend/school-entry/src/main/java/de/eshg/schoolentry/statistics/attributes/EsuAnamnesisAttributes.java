/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuAnamnesisAttributes implements EsuAttributes {
  KT(
      ValueWithOptionsAttribute.create(
          "Krippe + KT-Besuch  nach Monaten gruppiert",
          "KT",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Daycare.values()))),

  KISS(BooleanAttribute.create("Kiss", "KISS", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  VLK(
      BooleanAttribute.create(
          "Vorlaufkurs", "VLK", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GG(
      IntegerAttribute.create(
          "Geburtsgewicht",
          "GG",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          EsuAttributeUtil.createUnknownOption("9999"))),

  SSW_DAUER(
      BooleanAttribute.create(
          "Schwangerschaftsdauer regelrecht",
          "SSW_DAUER",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          false)),

  U2E(
      ValueWithOptionsAttribute.create(
          "U2",
          "U2E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U3E(
      ValueWithOptionsAttribute.create(
          "U3",
          "U3E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U4E(
      ValueWithOptionsAttribute.create(
          "U4",
          "U4E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U5E(
      ValueWithOptionsAttribute.create(
          "U5",
          "U5E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U6E(
      ValueWithOptionsAttribute.create(
          "U6",
          "U6E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U7E(
      ValueWithOptionsAttribute.create(
          "U7",
          "U7E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U7A(
      ValueWithOptionsAttribute.create(
          "U7a",
          "U7A",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U8E(
      ValueWithOptionsAttribute.create(
          "U8",
          "U8E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  U9E(
      ValueWithOptionsAttribute.create(
          "U9",
          "U9E",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  FF(
      BooleanAttribute.create(
          "Frühförderung", "FF", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  IP(
      BooleanAttribute.create(
          "Integrationsplatz", "IP", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  ERGO(
      BooleanAttribute.create(
          "Ergotherapie", "ERGO", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  LOGO(
      BooleanAttribute.create(
          "Logopädie - Sprachtherapie", "LOGO", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  KG(
      BooleanAttribute.create(
          "Krankengymnastik", "KG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  MIG(
      BooleanAttribute.create(
          "Migrationshintergrund", "MIG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI_TEXT(
      TextAttribute.create(
          "Geburtsland Kind", "GEBKI_Text", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI_LKZ(
      TextAttribute.create(
          "Geburtsland Kind LKZ", "GEBKI_LKZ", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI(
      ValueWithOptionsAttribute.create(
          "Geburtsland Kind gruppiert",
          "GEBKI",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()))),

  STAKI_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Kind",
          "STAKI_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAKI_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Kind LKZ",
          "STAKI_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAKI(
      ValueWithOptionsAttribute.create(
          "Staatsangehörigkeit Kind gruppiert",
          "STAKI",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()))),

  GEBET1_TEXT(
      TextAttribute.create(
          "Geburtsland des Elternteil 1",
          "GEBET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET1_FFM(
      TextAttribute.create(
          "Geburtsland des Elternteil 1 LKZ",
          "GEBET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET1(
      ValueWithOptionsAttribute.create(
          "Geburtsland des Elternteil 1 gruppiert",
          "GEBET1",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()))),

  STAET1_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 1",
          "STAET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET1_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 1 LKZ",
          "STAET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET1(
      ValueWithOptionsAttribute.create(
          "Staatsangehörigkeit Elternteil 1 gruppiert",
          "STAET1",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()))),

  GEBET2_TEXT(
      TextAttribute.create(
          "Geburtsland des Elternteil 2",
          "GEBET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET2_FFM(
      TextAttribute.create(
          "Geburtsland des Elternteil 2 LKZ",
          "GEBET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET2(
      ValueWithOptionsAttribute.create(
          "Geburtsland des Elternteil 2 gruppiert",
          "GEBET2",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values()))),

  STAET2_TEXT(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 2",
          "STAET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET2_FFM(
      TextAttribute.create(
          "Staatsangehörigkeit bei Geburt Elternteil 2 LKZ",
          "STAET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET2(
      ValueWithOptionsAttribute.create(
          "Staatsangehörigkeit Elternteil 2 gruppiert",
          "STAET2",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true,
          convertToValueOptions(Country.values())));

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
