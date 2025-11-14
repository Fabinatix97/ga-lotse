/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuVaccinationAttribute implements EsuAttributes {
  IMPFBUCH(
      BooleanAttribute.create(
          "Impfbuch vorgelegt",
          "ImpfBuch",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          DataPrivacyCategory.INSENSITIVE)),

  IMPFSCHEMA(
      ValueWithOptionsAttribute.createSensitive(
          "Impfschema \"2+1\" und \"3+1\" ",
          "Impfschema",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          convertToValueOptions(VaccinationScheme.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DIP(
      ValueWithOptionsAttribute.createSensitive(
          "Impfung Diphtherie Summe",
          "Dip",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  TET(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Tetanus Summe",
          "Tet",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  PER(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Pertussis Summe",
          "Per",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  HIB(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen HIB Summe",
          "HIB",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  POL(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Polio Summe",
          "Pol",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  PERKOMBIHBV(
      ValueWithOptionsAttribute.createSensitive(
          "PerkombiHBV",
          "PerkombiHBV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          convertToValueOptions(BooleanWithUnknown.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  HBV(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Hepatitis B Summe",
          "HBV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  PNEUMO(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Pneumokokken Summe",
          "Pneumo",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  MMR(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Maser, Mumps, Röteln Summe",
          "MMR",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  VARI(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Varizellen Summe",
          "Vari",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  MENB(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Meningokokken B Summe",
          "MenB",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  MENC(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Meningokokken C Summe",
          "MenC",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  ROTA(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Rota Summe",
          "Rota",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  FSME(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen FSME Summe",
          "FSME",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  HAV(
      ValueWithOptionsAttribute.createSensitive(
          "Impfungen Hepatitis A Summe",
          "HAV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions(),
          new SensitiveParameters(null, 0.2),
          null));

  private static final String CATEGORY_VACCINATION = "Impfungen";

  private final AttributeData attribute;

  EsuVaccinationAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
