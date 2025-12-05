/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.statistic;

import static de.eshg.lib.common.CountryCode.getCountryName;
import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.prostituteprotection.statistic.model.DocumentType;
import de.eshg.prostituteprotection.statistic.model.Language;
import java.util.stream.Stream;

public enum ProstituteProtectionAttributes implements AttributeInfo {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", ProstituteProtectionAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),
  AGE(
      IntegerAttribute.createQuasiIdentifying(
          "Alter",
          "AGE",
          ProstituteProtectionAttributes.CATEGORY_PERSON,
          true,
          null,
          null,
          new IntegerMinMaxCountIntervalConfiguration(-1, 150, 10))),
  ALIAS(
      BooleanAttribute.create(
          "Alias",
          "ALIAS",
          ProstituteProtectionAttributes.CATEGORY_PERSON,
          true,
          DataPrivacyCategory.QUASI_IDENTIFYING)),
  DOCUMENT_TYPE(
      ValueWithOptionsAttribute.create(
          "Ausweisdokument",
          "DOCUMENT_TYPE",
          ProstituteProtectionAttributes.CATEGORY_PERSON,
          true,
          convertToValueOptions(DocumentType.values()),
          DataPrivacyCategory.INSENSITIVE)),
  NATIONALITY(
      ValueWithOptionsAttribute.create(
          "Staatsangehörigkeit",
          "NATIONALITY",
          ProstituteProtectionAttributes.CATEGORY_PERSON,
          true,
          Stream.of(CountryCode.values())
              .map(e -> new ValueOptionInternal(e.name(), getCountryName(e), false))
              .toList(),
          DataPrivacyCategory.QUASI_IDENTIFYING)),
  CONSULTATION_DATE(
      TextAttribute.create(
          "Datum der Beratung",
          "CONSULTATION_DATE",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),
  CONSULTATION_TYPE(
      TextAttribute.create(
          "Art der Beratung",
          "CONSULTATION_TYPE",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          null,
          DataPrivacyCategory.INSENSITIVE)),
  CONSULTATION_LANGUAGE(
      ValueWithOptionsAttribute.create(
          "Sprache der Beratung",
          "CONSULTATION_LANGUAGE",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          convertToValueOptions(Language.values()),
          DataPrivacyCategory.QUASI_IDENTIFYING)),
  INFORMATION_MATERIAL(
      BooleanAttribute.createSensitive(
          "Infomaterial",
          "INFORMATION_MATERIAL",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          0.2)),
  CLEARING(
      BooleanAttribute.createSensitive(
          "Beratungsbedarf / Clearing",
          "CLEARING",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          0.2)),
  REFERRAL(
      BooleanAttribute.createSensitive(
          "Weitervermittlung §19",
          "REFERRAL",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          0.2)),
  PREDICAMENT(
      BooleanAttribute.createSensitive(
          "Notlage / Zwangslage",
          "PREDICAMENT",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          0.2)),
  INTERPRETER(
      BooleanAttribute.create(
          "Dolmetscher",
          "INTERPRETER",
          ProstituteProtectionAttributes.CATEGORY_CONSULTATION,
          true,
          DataPrivacyCategory.QUASI_IDENTIFYING)),
  ;

  static final String CATEGORY_PERSON = "Person";
  static final String CATEGORY_CONSULTATION = "Beratung";
  static final String CATEGORY_PROCEDURE_REFERENCE = "Vorgangsreferenz";

  private final AttributeData attribute;

  ProstituteProtectionAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
