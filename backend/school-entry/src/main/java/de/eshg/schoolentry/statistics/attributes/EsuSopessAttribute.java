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
      IntegerAttribute.create(
          "Körperkoordination (Sprungzahl)",
          "KOORD",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  KOORD1(
      ValueWithOptionsAttribute.create(
          "Körperkoordniation Bewertung",
          "KOORD1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  GROMO(
      ValueWithOptionsAttribute.create(
          "Ergebnis Grobmotorik",
          "GROMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_GROMO(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Grobmotorik",
          "KW_RM_GROMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  VISMOT(
      IntegerAttribute.create(
          "Visuomotorik",
          "VISMOT",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  VISMOT1(
      ValueWithOptionsAttribute.create(
          "Visuomotorik Bewertung",
          "VISMOT1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  FEIMO(
      ValueWithOptionsAttribute.create(
          "Ergebnis Feinmotorik",
          "FEIMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_FEIMO(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Feinmotorik",
          "KW_RM_FEIMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  HAND(
      ValueWithOptionsAttribute.create(
          "Händigkeit",
          "HAND",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(Hand.values()))),

  VISPER(
      IntegerAttribute.create(
          "Visuelle Perzeption",
          "VISPER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  VISPER1(
      ValueWithOptionsAttribute.create(
          "Visuelle Perzeption Bewertung",
          "VISPER1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  VISWA(
      ValueWithOptionsAttribute.create(
          "Ergebnis Visuelle Wahrnehmung",
          "VISWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_VISWA(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Visuelle Wahrnehmung",
          "KW_RM_VISWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  ESPR(
      ValueWithOptionsAttribute.create(
          "Erstsprache Kind",
          "ESPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(FirstLanguage.values()))),

  FAMSPR(
      ValueWithOptionsAttribute.create(
          "Familiensprache",
          "FAMSPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Language.values()))),

  SPRBP(
      ValueWithOptionsAttribute.create(
          "Sprachkenntnisse Hauptbezugsperson",
          "SPRBP",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(GuardianLanguageKnowledge.values()))),

  SPRDEU(
      ValueWithOptionsAttribute.create(
          "Sprachkenntnisse Kind",
          "SPRDEU",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ChildLanguageKnowledge.values()))),

  DYS_S_Z(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstaben S + Z",
          "DYS_S_Z",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_SCH(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Lautbildung SCH",
          "DYS_SCH",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_T_D(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstaben T + D",
          "DYS_T_D",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_CH(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Lautbildung CH",
          "DYS_CH",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_G_K(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstaben G + K",
          "DYS_G_K",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_L_N(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstaben L + N",
          "DYS_L_N",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_R(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstabe R",
          "DYS_R",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_F_PF(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstabe F, Lautbildung PF",
          "DYS_F_PF",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_B(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Buchstabe B",
          "DYS_B",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS_TR_DR_KR_GR(
      ValueWithOptionsAttribute.create(
          "Artikulation/ Dyslalie Lautbildung tr, dr, kr + gr",
          "DYS_tr_dr_kr_gr",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()))),

  DYS(
      ValueWithOptionsAttribute.create(
          "Ergebnis (Summe - Punkte) Artikulation, Dyslalie",
          "DYS",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createDyslaliaOptions())),

  DYS1(
      ValueWithOptionsAttribute.create(
          "Artikulation, Dyslalie Bewertung",
          "DYS1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          List.of(
              new ValueOptionInternal("A", "auffällig", false),
              new ValueOptionInternal("U", "unauffällig", false)))),

  SPR(
      ValueWithOptionsAttribute.create(
          "Ergebnis Sprache",
          "SPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_SPR(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Sprache",
          "KW_RM_SPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  PSWOE(
      IntegerAttribute.create(
          "Pseudowörter",
          "PSWOE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("9"))),

  PSWOE1(
      ValueWithOptionsAttribute.create(
          "Pseudowörter Bewertung",
          "PSWOE1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  PRAEP(
      IntegerAttribute.create(
          "Präpositionen",
          "PRAEP",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("9"))),

  PRAEP1(
      ValueWithOptionsAttribute.create(
          "Präpositionen Bewertung",
          "PRAEP1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  PLUR(
      IntegerAttribute.create(
          "Plurale",
          "PLUR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("9"))),

  PLUR1(
      ValueWithOptionsAttribute.create(
          "Plurale Bewertung",
          "PLUR1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  AUDWA(
      ValueWithOptionsAttribute.create(
          "Ergebnis Auditive Infoverarbeitung",
          "AUDWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_AUSWA(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Auditive Infoverarbeitung",
          "KW_RM_AUSWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  ZAEHL(
      IntegerAttribute.create(
          "Zählen",
          "ZAEHL",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  ZAEHL1(
      ValueWithOptionsAttribute.create(
          "Zählen Bewertung",
          "ZAEHL1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  MENG(
      IntegerAttribute.create(
          "Mengenvorwissen",
          "MENG",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  MENG1(
      ValueWithOptionsAttribute.create(
          "Mengenvorwissen Bewertung",
          "MENG1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  WISSDE(
      ValueWithOptionsAttribute.create(
          "Ergebnis Wissen/ Denken",
          "WISSDE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_WISSDE(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Wissen/ Denken",
          "KW_RM_WISSDE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  SELAUFM(
      IntegerAttribute.create(
          "Selektive Aufmerksamkeit",
          "SELAUFM",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createUnknownOption("99"))),

  SELAUFM1(
      ValueWithOptionsAttribute.create(
          "Selektive Aufmerksamkeit Bewertung",
          "SELAUFM1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()))),

  PSYVER(
      ValueWithOptionsAttribute.create(
          "Ergebnis psychisches Verhalten",
          "PSYVER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()))),

  KW_RM_PSYVER(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief psychisches Verhalten",
          "KW_RM_PSYVER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),
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
