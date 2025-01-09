/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuVaccinationAttribute implements EsuAttributes {
  IMPFBUCH(
      new BooleanAttribute(
          "Impfbuch vorgelegt", "ImpfBuch", EsuVaccinationAttribute.CATEGORY_VACCINATION, true)),

  IMPFSCHEMA(
      new ValueWithOptionsAttribute(
          "Impfschema \"2+1\" und \"3+1\" ",
          "Impfschema",
          convertToValueOptions(VaccinationScheme.values()),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  DIP(
      new ValueWithOptionsAttribute(
          "Impfung Diphtherie Summe",
          "Dip",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  TET(
      new ValueWithOptionsAttribute(
          "Impfungen Tetanus Summe",
          "Tet",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  PER(
      new ValueWithOptionsAttribute(
          "Impfungen Pertussis Summe",
          "Per",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  HIB(
      new ValueWithOptionsAttribute(
          "Impfungen HIB Summe",
          "HIB",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  POL(
      new ValueWithOptionsAttribute(
          "Impfungen Polio Summe",
          "Pol",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  PERKOMBIHBV(
      new ValueWithOptionsAttribute(
          "PerkombiHBV",
          "PerkombiHBV",
          convertToValueOptions(BooleanWithUnknown.values()),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  HBV(
      new ValueWithOptionsAttribute(
          "Impfungen Hepatitis B Summe",
          "HBV",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  PNEUMO(
      new ValueWithOptionsAttribute(
          "Impfungen Pneumokokken Summe",
          "Pneumo",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  MMR(
      new ValueWithOptionsAttribute(
          "Impfungen Maser, Mumps, Röteln Summe",
          "MMR",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  VARI(
      new ValueWithOptionsAttribute(
          "Impfungen Varizellen Summe",
          "Vari",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  MENB(
      new ValueWithOptionsAttribute(
          "Impfungen Meningokokken B Summe",
          "MenB",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  MENC(
      new ValueWithOptionsAttribute(
          "Impfungen Meningokokken C Summe",
          "MenC",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  ROTA(
      new ValueWithOptionsAttribute(
          "Impfungen Rota Summe",
          "Rota",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  FSME(
      new ValueWithOptionsAttribute(
          "Impfungen FSME Summe",
          "FSME",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true)),

  HAV(
      new ValueWithOptionsAttribute(
          "Impfungen Hepatitis A Summe",
          "HAV",
          EsuAttributeUtil.createVaccinationCountOptions(),
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true));

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
