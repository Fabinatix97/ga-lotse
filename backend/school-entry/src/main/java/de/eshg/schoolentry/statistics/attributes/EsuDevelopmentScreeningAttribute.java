/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;
import static de.eshg.schoolentry.statistics.attributes.EsuAttributeUtil.UNKNOWN_DECIMAL_99_9;
import static de.eshg.schoolentry.statistics.attributes.EsuAttributeUtil.UNKNOWN_INTEGER_999;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.DecimalAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.schoolentry.statistics.options.*;

public enum EsuDevelopmentScreeningAttribute implements EsuAttributes {
  KIND(
      ValueWithOptionsAttribute.create(
          "Status Kind",
          "KIND",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(Child.values()))),

  GROE(
      DecimalAttribute.create(
          "Größe",
          "GROE",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "m",
          EsuAttributeUtil.createUnknownOption(Integer.toString(UNKNOWN_INTEGER_999)))),

  GROE_PERZ(
      DecimalAttribute.create(
          "Größe_Perzentile",
          "GROE_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  GEWI(
      DecimalAttribute.create(
          "Gewicht",
          "GEWI",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "kg",
          EsuAttributeUtil.createUnknownOption(Double.toString(UNKNOWN_DECIMAL_99_9)))),

  GEWI_PERZ(
      DecimalAttribute.create(
          "Gewicht_Perzentile",
          "GEWI_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  BMI(
      DecimalAttribute.create(
          "BMI", "BMI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  BMI_PERZ(
      DecimalAttribute.create(
          "BMI_Perzentile", "BMI_PERZ", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  RRSYS(
      IntegerAttribute.create(
          "RR_systolisch",
          "RRSYS",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"))),

  RRDIA(
      IntegerAttribute.create(
          "RR_diastolisch",
          "RRDIA",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"))),

  KOERPERCHECK(
      ValueWithOptionsAttribute.create(
          "Ergebnis körperliche Untersuchung",
          "KOERPERCHECK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(PhysicalExaminationResult.values()))),

  EZ(
      ValueWithOptionsAttribute.create(
          "Ernährungszustand",
          "EZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_ERNAEHRUNGSZUSTAND(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Ernährungszustand",
          "RM Ernährungszustand",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  NEU(
      ValueWithOptionsAttribute.create(
          "Neuro",
          "NEU",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_NEUROLOGIE(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Neurologie",
          "RM Neurologie",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  AHK(
      ValueWithOptionsAttribute.create(
          "Atmung-Herz-Kreislauf",
          "AHK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_ATMUNG_HERZ_KREISLAUF(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Atmung-Herz-Kreislauf",
          "RM Atmung-Herz-Kreislauf",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  DERM(
      ValueWithOptionsAttribute.create(
          "Hautzustand",
          "DERM",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_HAUT(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Haut",
          "RM Haut",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  MUSK(
      ValueWithOptionsAttribute.create(
          "Muskulatur",
          "MUSK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_MUSKULATUR_SKELETT(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Muskulatur,Skelett",
          "RM Muskulatur,Skelett",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  ENDO(
      ValueWithOptionsAttribute.create(
          "Endo/Stoffwechsel",
          "ENDO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_ENDO_STOFFW(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Endo/Stoffwechsel",
          "RM Endo/Stoffw.",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  ABD(
      ValueWithOptionsAttribute.create(
          "Abdomen",
          "ABD",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_ABDOMEN(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief Abdomen",
          "RM Abdomen",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  HNO(
      ValueWithOptionsAttribute.create(
          "Hals-Nasen-Ohren",
          "HNO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(ExaminationResultFourOptions.values()))),

  RM_HNO(
      ValueWithOptionsAttribute.create(
          "Rückmeldung Arztbrief HNO",
          "RM HNO",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(DoctorLetterValue.values()))),

  HANDCAP(
      BooleanAttribute.create(
          "Handicap", "HANDCAP", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  CHKR(
      BooleanAttribute.create(
          "chronische Krankheit",
          "CHKR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  DIAGCH1(
      TextAttribute.create(
          "Diagnose 1, chron. Krankheit",
          "DIAGCH1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGCH2(
      TextAttribute.create(
          "Diagnose 2, chron. Krankheit",
          "DIAGCH2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGCH3(
      TextAttribute.create(
          "Diagnose 3, chron. Krankheit",
          "DIAGCH3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  BEHI(
      BooleanAttribute.create(
          "Behinderung", "BEHI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  BEHIART(
      ValueWithOptionsAttribute.create(
          "Art der Behinderung",
          "BEHIART",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false,
          convertToValueOptions(Disability.values()))),

  DIAGB1(
      TextAttribute.create(
          "Diagnose 1, Behinderung",
          "DIAGB1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGB2(
      TextAttribute.create(
          "Diagnose 2, Behinderung",
          "DIAGB2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGB3(
      TextAttribute.create(
          "Diagnose 3, Behinderung",
          "DIAGB3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  PSYSOZRISK(
      BooleanAttribute.create(
          "Psychosoziales Risiko",
          "PSYSOZRISK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  FAMILIE(
      BooleanAttribute.create(
          "Familie", "Familie", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  NONCOMP(
      BooleanAttribute.create(
          "Non-Compliance", "NonComp", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOZIAL(
      BooleanAttribute.create(
          "Sozial", "Sozial", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  MIGRATION(
      BooleanAttribute.create(
          "Migration", "Migration", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SONSTIGES_RISIKO(
      BooleanAttribute.create(
          "Sonstiges Risiko",
          "Sonstiges Risiko",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  MASSN(
      BooleanAttribute.create(
          "sozialpädiatrische Leistung",
          "MASSN",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  WSPR(
      BooleanAttribute.create(
          "Wiedervorstellung in Sprechstunde",
          "WSPR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  SCHB(
      BooleanAttribute.create(
          "Schulberatung", "SCHB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  MOTO(
      BooleanAttribute.create(
          "Motorikförderung", "MOTO", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  ERZB(
      BooleanAttribute.create(
          "Erziehungsberatung", "ERZB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SPRF(
      BooleanAttribute.create(
          "Sprachförderung", "SPRF", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  ERNB(
      BooleanAttribute.create(
          "Ernährungsberatung", "ERNB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  IMPF(
      BooleanAttribute.create(
          "Impfberatung", "IMPF", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOZD(
      BooleanAttribute.create(
          "Sozialdienst", "SOZD", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOHI(
      BooleanAttribute.create(
          "sonstige Hilfen", "SOHI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  INFO(
      BooleanAttribute.create(
          "Infobrief", "INFO", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SCHULEMPF(
      ValueWithOptionsAttribute.create(
          "Schulempfehlung",
          "SCHULEMPF",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true,
          convertToValueOptions(SchoolRecommendation.values()))),

  MEHR(
      BooleanAttribute.create(
          "Mehraufwand", "MEHR", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),
  ;

  private static final String CATEGORY_S1_RESULT = "S1-Befund";

  private final AttributeData attribute;

  EsuDevelopmentScreeningAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
