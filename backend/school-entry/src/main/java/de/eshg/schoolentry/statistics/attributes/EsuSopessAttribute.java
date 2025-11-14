/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;
import java.util.List;

public enum EsuSopessAttribute implements EsuAttributes {
  KOORD(
      IntegerAttribute.createSensitive(
          "Körperkoordination (Sprungzahl)",
          "KOORD",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  KOORD1(
      ValueWithOptionsAttribute.createSensitive(
          "Körperkoordniation Bewertung",
          "KOORD1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  GROMO(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Grobmotorik",
          "GROMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_GROMO(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Grobmotorik",
          "KW_RM_GROMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  VISMOT(
      IntegerAttribute.createSensitive(
          "Visuomotorik",
          "VISMOT",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  VISMOT1(
      ValueWithOptionsAttribute.createSensitive(
          "Visuomotorik Bewertung",
          "VISMOT1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  FEIMO(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Feinmotorik",
          "FEIMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_FEIMO(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Feinmotorik",
          "KW_RM_FEIMO",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  HAND(
      ValueWithOptionsAttribute.createSensitive(
          "Händigkeit",
          "HAND",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(Hand.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  VISPER(
      IntegerAttribute.createSensitive(
          "Visuelle Perzeption",
          "VISPER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  VISPER1(
      ValueWithOptionsAttribute.createSensitive(
          "Visuelle Perzeption Bewertung",
          "VISPER1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  VISWA(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Visuelle Wahrnehmung",
          "VISWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_VISWA(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Visuelle Wahrnehmung",
          "KW_RM_VISWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  ESPR(
      ValueWithOptionsAttribute.create(
          "Erstsprache Kind",
          "ESPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(FirstLanguage.values()),
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  FAMSPR(
      ValueWithOptionsAttribute.create(
          "Familiensprache",
          "FAMSPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Language.values()),
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  SPRBP(
      ValueWithOptionsAttribute.createSensitive(
          "Sprachkenntnisse Hauptbezugsperson",
          "SPRBP",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(GuardianLanguageKnowledge.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  SPRDEU(
      ValueWithOptionsAttribute.createSensitive(
          "Sprachkenntnisse Kind",
          "SPRDEU",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ChildLanguageKnowledge.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  WOHND(
      TextAttribute.createSensitive(
          "bei Einreise: in Deutschland seit (Neue Variable ab S1_2023)",
          "WOHND",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          new SensitiveParameters(null, 0.2))),

  DYS_S_Z(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstaben S + Z",
          "DYS_S_Z",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_SCH(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Lautbildung SCH",
          "DYS_SCH",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_T_D(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstaben T + D",
          "DYS_T_D",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_CH(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Lautbildung CH",
          "DYS_CH",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_G_K(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstaben G + K",
          "DYS_G_K",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_L_N(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstaben L + N",
          "DYS_L_N",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_R(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstabe R",
          "DYS_R",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_F_PF(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstabe F, Lautbildung PF",
          "DYS_F_PF",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_B(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Buchstabe B",
          "DYS_B",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS_TR_DR_KR_GR(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation/ Dyslalie Lautbildung tr, dr, kr + gr",
          "DYS_tr_dr_kr_gr",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(Articulation.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis (Summe - Punkte) Artikulation, Dyslalie",
          "DYS",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          EsuAttributeUtil.createDyslaliaOptions(),
          new SensitiveParameters(null, 0.2),
          null)),

  DYS1(
      ValueWithOptionsAttribute.createSensitive(
          "Artikulation, Dyslalie Bewertung",
          "DYS1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          List.of(
              new ValueOptionInternal("A", "auffällig", false),
              new ValueOptionInternal("U", "unauffällig", false)),
          new SensitiveParameters(null, 0.2),
          null)),

  SPR(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Sprache",
          "SPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_SPR(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Sprache",
          "KW_RM_SPR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  PSWOE(
      IntegerAttribute.createSensitive(
          "Pseudowörter",
          "PSWOE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("9"),
          new SensitiveParameters(null, 0.2))),

  PSWOE1(
      ValueWithOptionsAttribute.createSensitive(
          "Pseudowörter Bewertung",
          "PSWOE1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  PRAEP(
      IntegerAttribute.createSensitive(
          "Präpositionen",
          "PRAEP",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("9"),
          new SensitiveParameters(null, 0.2))),

  PRAEP1(
      ValueWithOptionsAttribute.createSensitive(
          "Präpositionen Bewertung",
          "PRAEP1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  PLUR(
      IntegerAttribute.createSensitive(
          "Plurale",
          "PLUR",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("9"),
          new SensitiveParameters(null, 0.2))),

  PLUR1(
      ValueWithOptionsAttribute.createSensitive(
          "Plurale Bewertung",
          "PLUR1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  AUDWA(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Auditive Infoverarbeitung",
          "AUDWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_AUSWA(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Auditive Infoverarbeitung",
          "KW_RM_AUSWA",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  ZAEHL(
      IntegerAttribute.createSensitive(
          "Zählen",
          "ZAEHL",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  ZAEHL1(
      ValueWithOptionsAttribute.createSensitive(
          "Zählen Bewertung",
          "ZAEHL1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  MENG(
      IntegerAttribute.createSensitive(
          "Mengenvorwissen",
          "MENG",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  MENG1(
      ValueWithOptionsAttribute.createSensitive(
          "Mengenvorwissen Bewertung",
          "MENG1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  WISSDE(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis Wissen/ Denken",
          "WISSDE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_WISSDE(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief Wissen/ Denken",
          "KW_RM_WISSDE",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  SELAUFM(
      IntegerAttribute.createSensitive(
          "Selektive Aufmerksamkeit",
          "SELAUFM",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          null,
          EsuAttributeUtil.createUnknownOption("99"),
          new SensitiveParameters(null, 0.2))),

  SELAUFM1(
      ValueWithOptionsAttribute.createSensitive(
          "Selektive Aufmerksamkeit Bewertung",
          "SELAUFM1",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(EvaluationResult.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  PSYVER(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis psychisches Verhalten",
          "PSYVER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          true,
          convertToValueOptions(ExaminationResultFiveOptions.values()),
          new SensitiveParameters(null, 0.2),
          null)),

  KW_RM_PSYVER(
      ValueWithOptionsAttribute.createSensitive(
          "Rückmeldung Arztbrief psychisches Verhalten",
          "KW_RM_PSYVER",
          EsuSopessAttribute.CATEGORY_S1_SOPESS,
          false,
          convertToValueOptions(DoctorLetterValue.values()),
          new SensitiveParameters(null, 0.2),
          null)),
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
