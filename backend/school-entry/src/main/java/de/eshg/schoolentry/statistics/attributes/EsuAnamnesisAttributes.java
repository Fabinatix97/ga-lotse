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
      new ValueWithOptionsAttribute(
          "Krippe + KT-Besuch  nach Monaten gruppiert",
          "KT",
          convertToValueOptions(Daycare.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  KISS(new BooleanAttribute("Kiss", "KISS", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  VLK(new BooleanAttribute("Vorlaufkurs", "VLK", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GG(
      new IntegerAttribute(
          "Geburtsgewicht",
          "GG",
          EsuAttributeUtil.createUnknownOption("9999"),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  SSW_DAUER(
      new BooleanAttribute(
          "Schwangerschaftsdauer regelrecht",
          "SSW_DAUER",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          false)),

  U2E(
      new ValueWithOptionsAttribute(
          "U2",
          "U2E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U3E(
      new ValueWithOptionsAttribute(
          "U3",
          "U3E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U4E(
      new ValueWithOptionsAttribute(
          "U4",
          "U4E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U5E(
      new ValueWithOptionsAttribute(
          "U5",
          "U5E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U6E(
      new ValueWithOptionsAttribute(
          "U6",
          "U6E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U7E(
      new ValueWithOptionsAttribute(
          "U7",
          "U7E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U7A(
      new ValueWithOptionsAttribute(
          "U7a",
          "U7A",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U8E(
      new ValueWithOptionsAttribute(
          "U8",
          "U8E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  U9E(
      new ValueWithOptionsAttribute(
          "U9",
          "U9E",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  FF(new BooleanAttribute("Frühförderung", "FF", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  IP(
      new BooleanAttribute(
          "Integrationsplatz", "IP", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  ERGO(
      new BooleanAttribute(
          "Ergotherapie", "ERGO", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  LOGO(
      new BooleanAttribute(
          "Logopädie - Sprachtherapie", "LOGO", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  KG(
      new BooleanAttribute(
          "Krankengymnastik", "KG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  MIG(
      new BooleanAttribute(
          "Migrationshintergrund", "MIG", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI_TEXT(
      new TextAttribute(
          "Geburtsland Kind", "GEBKI_Text", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI_LKZ(
      new TextAttribute(
          "Geburtsland Kind LKZ", "GEBKI_LKZ", EsuAnamnesisAttributes.CATEGORY_ANAMNESIS, true)),

  GEBKI(
      new ValueWithOptionsAttribute(
          "Geburtsland Kind gruppiert",
          "GEBKI",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAKI_TEXT(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Kind",
          "STAKI_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAKI_FFM(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Kind LKZ",
          "STAKI_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAKI(
      new ValueWithOptionsAttribute(
          "Staatsangehörigkeit Kind gruppiert",
          "STAKI",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET1_TEXT(
      new TextAttribute(
          "Geburtsland des Elternteil 1",
          "GEBET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET1_FFM(
      new TextAttribute(
          "Geburtsland des Elternteil 1 LKZ",
          "GEBET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET1(
      new ValueWithOptionsAttribute(
          "Geburtsland des Elternteil 1 gruppiert",
          "GEBET1",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET1_TEXT(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Elternteil 1",
          "STAET1_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET1_FFM(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Elternteil 1 LKZ",
          "STAET1_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET1(
      new ValueWithOptionsAttribute(
          "Staatsangehörigkeit Elternteil 1 gruppiert",
          "STAET1",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET2_TEXT(
      new TextAttribute(
          "Geburtsland des Elternteil 2",
          "GEBET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET2_FFM(
      new TextAttribute(
          "Geburtsland des Elternteil 2 LKZ",
          "GEBET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  GEBET2(
      new ValueWithOptionsAttribute(
          "Geburtsland des Elternteil 2 gruppiert",
          "GEBET2",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET2_TEXT(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Elternteil 2",
          "STAET2_Text",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET2_FFM(
      new TextAttribute(
          "Staatsangehörigkeit bei Geburt Elternteil 2 LKZ",
          "STAET2_FFM",
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true)),

  STAET2(
      new ValueWithOptionsAttribute(
          "Staatsangehörigkeit Elternteil 2 gruppiert",
          "STAET2",
          convertToValueOptions(Country.values()),
          EsuAnamnesisAttributes.CATEGORY_ANAMNESIS,
          true));

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
