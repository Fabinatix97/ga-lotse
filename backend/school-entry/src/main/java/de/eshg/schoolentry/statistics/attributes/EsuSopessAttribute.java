/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;
import java.util.List;

public enum EsuSopessAttribute implements EsuAttributes {
  KOORD(
      new IntegerAttribute(
          "Körperkoordination (Sprungzahl)",
          "KOORD",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KOORD1(
      new ValueWithOptionsAttribute(
          "Körperkoordniation Bewertung",
          "KOORD1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  GROMO(
      new ValueWithOptionsAttribute(
          "Ergebnis Grobmotorik",
          "GROMO",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_GROMO(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Grobmotorik",
          "KW_RM_GROMO",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  VISMOT(
      new IntegerAttribute(
          "Visuomotorik",
          "VISMOT",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  VISMOT1(
      new ValueWithOptionsAttribute(
          "Visuomotorik Bewertung",
          "VISMOT1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  FEIMO(
      new ValueWithOptionsAttribute(
          "Ergebnis Feinmotorik",
          "FEIMO",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_FEIMO(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Feinmotorik",
          "KW_RM_FEIMO",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  HAND(
      new ValueWithOptionsAttribute(
          "Händigkeit",
          "HAND",
          convertToValueOptions(Hand.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  VISPER(
      new IntegerAttribute(
          "Visuelle Perzeption",
          "VISPER",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  VISPER1(
      new ValueWithOptionsAttribute(
          "Visuelle Perzeption Bewertung",
          "VISPER1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  VISWA(
      new ValueWithOptionsAttribute(
          "Ergebnis Visuelle Wahrnehmung",
          "VISWA",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_VISWA(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Visuelle Wahrnehmung",
          "KW_RM_VISWA",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  ESPR(
      new ValueWithOptionsAttribute(
          "Erstsprache Kind",
          "ESPR",
          convertToValueOptions(FirstLanguage.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  FAMSPR(
      new ValueWithOptionsAttribute(
          "Familiensprache",
          "FAMSPR",
          convertToValueOptions(Language.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  SPRBP(
      new ValueWithOptionsAttribute(
          "Sprachkenntnisse Hauptbezugsperson",
          "SPRBP",
          convertToValueOptions(GuardianLanguageKnowledge.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  SPRDEU(
      new ValueWithOptionsAttribute(
          "Sprachkenntnisse Kind",
          "SPRDEU",
          convertToValueOptions(ChildLanguageKnowledge.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_S_Z(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstaben S + Z",
          "DYS_S_Z",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_SCH(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Lautbildung SCH",
          "DYS_SCH",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_T_D(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstaben T + D",
          "DYS_T_D",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_CH(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Lautbildung CH",
          "DYS_CH",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_G_K(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstaben G + K",
          "DYS_G_K",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_L_N(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstaben L + N",
          "DYS_L_N",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_R(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstabe R",
          "DYS_R",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_F_PF(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstabe F, Lautbildung PF",
          "DYS_F_PF",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_B(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Buchstabe B",
          "DYS_B",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS_TR_DR_KR_GR(
      new ValueWithOptionsAttribute(
          "Artikulation/ Dyslalie Lautbildung tr, dr, kr + gr",
          "DYS_tr_dr_kr_gr",
          convertToValueOptions(Articulation.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS(
      new ValueWithOptionsAttribute(
          "Ergebnis (Summe - Punkte) Artikulation, Dyslalie",
          "DYS",
          EsuAttributeUtil.createDyslaliaOptions(),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  DYS1(
      new ValueWithOptionsAttribute(
          "Artikulation, Dyslalie Bewertung",
          "DYS1",
          List.of(
              new ValueOptionInternal("A", "auffällig", false),
              new ValueOptionInternal("U", "unauffällig", false)),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  SPR(
      new ValueWithOptionsAttribute(
          "Ergebnis Sprache",
          "SPR",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_SPR(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Sprache",
          "KW_RM_SPR",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  PSWOE(
      new IntegerAttribute(
          "Pseudowörter",
          "PSWOE",
          EsuAttributeUtil.createUnknownOption("9"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PSWOE1(
      new ValueWithOptionsAttribute(
          "Pseudowörter Bewertung",
          "PSWOE1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PRAEP(
      new IntegerAttribute(
          "Präpositionen",
          "PRAEP",
          EsuAttributeUtil.createUnknownOption("9"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PRAEP1(
      new ValueWithOptionsAttribute(
          "Präpositionen Bewertung",
          "PRAEP1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PLUR(
      new IntegerAttribute(
          "Plurale",
          "PLUR",
          EsuAttributeUtil.createUnknownOption("9"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PLUR1(
      new ValueWithOptionsAttribute(
          "Plurale Bewertung",
          "PLUR1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  AUDWA(
      new ValueWithOptionsAttribute(
          "Ergebnis Auditive Infoverarbeitung",
          "AUDWA",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_AUSWA(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Auditive Infoverarbeitung",
          "KW_RM_AUSWA",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  ZAEHL(
      new IntegerAttribute(
          "Zählen",
          "ZAEHL",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  ZAEHL1(
      new ValueWithOptionsAttribute(
          "Zählen Bewertung",
          "ZAEHL1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  MENG(
      new IntegerAttribute(
          "Mengenvorwissen",
          "MENG",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  MENG1(
      new ValueWithOptionsAttribute(
          "Mengenvorwissen Bewertung",
          "MENG1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  WISSDE(
      new ValueWithOptionsAttribute(
          "Ergebnis Wissen/ Denken",
          "WISSDE",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_WISSDE(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Wissen/ Denken",
          "KW_RM_WISSDE",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),

  SELAUFM(
      new IntegerAttribute(
          "Selektive Aufmerksamkeit",
          "SELAUFM",
          EsuAttributeUtil.createUnknownOption("99"),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  SELAUFM1(
      new ValueWithOptionsAttribute(
          "Selektive Aufmerksamkeit Bewertung",
          "SELAUFM1",
          convertToValueOptions(EvaluationResult.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  PSYVER(
      new ValueWithOptionsAttribute(
          "Ergebnis psychisches Verhalten",
          "PSYVER",
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true)),

  KW_RM_PSYVER(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief psychisches Verhalten",
          "KW_RM_PSYVER",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false)),
  ;

  private static final String CATEGORY_S1_SOPESS = "S1-Sopess";

  private final AttributeData attribute;

  EsuSopessAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
