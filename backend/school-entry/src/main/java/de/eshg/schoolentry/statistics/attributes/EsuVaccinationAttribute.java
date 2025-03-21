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
      BooleanAttribute.create(
          "Impfbuch vorgelegt", "ImpfBuch", EsuVaccinationAttribute.CATEGORY_VACCINATION, true)),

  IMPFSCHEMA(
      ValueWithOptionsAttribute.create(
          "Impfschema \"2+1\" und \"3+1\" ",
          "Impfschema",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          convertToValueOptions(VaccinationScheme.values()))),

  DIP(
      ValueWithOptionsAttribute.create(
          "Impfung Diphtherie Summe",
          "Dip",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  TET(
      ValueWithOptionsAttribute.create(
          "Impfungen Tetanus Summe",
          "Tet",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  PER(
      ValueWithOptionsAttribute.create(
          "Impfungen Pertussis Summe",
          "Per",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  HIB(
      ValueWithOptionsAttribute.create(
          "Impfungen HIB Summe",
          "HIB",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  POL(
      ValueWithOptionsAttribute.create(
          "Impfungen Polio Summe",
          "Pol",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  PERKOMBIHBV(
      ValueWithOptionsAttribute.create(
          "PerkombiHBV",
          "PerkombiHBV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          convertToValueOptions(BooleanWithUnknown.values()))),

  HBV(
      ValueWithOptionsAttribute.create(
          "Impfungen Hepatitis B Summe",
          "HBV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  PNEUMO(
      ValueWithOptionsAttribute.create(
          "Impfungen Pneumokokken Summe",
          "Pneumo",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  MMR(
      ValueWithOptionsAttribute.create(
          "Impfungen Maser, Mumps, Röteln Summe",
          "MMR",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  VARI(
      ValueWithOptionsAttribute.create(
          "Impfungen Varizellen Summe",
          "Vari",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  MENB(
      ValueWithOptionsAttribute.create(
          "Impfungen Meningokokken B Summe",
          "MenB",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  MENC(
      ValueWithOptionsAttribute.create(
          "Impfungen Meningokokken C Summe",
          "MenC",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  ROTA(
      ValueWithOptionsAttribute.create(
          "Impfungen Rota Summe",
          "Rota",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  FSME(
      ValueWithOptionsAttribute.create(
          "Impfungen FSME Summe",
          "FSME",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions())),

  HAV(
      ValueWithOptionsAttribute.create(
          "Impfungen Hepatitis A Summe",
          "HAV",
          EsuVaccinationAttribute.CATEGORY_VACCINATION,
          true,
          EsuAttributeUtil.createVaccinationCountOptions()));

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
