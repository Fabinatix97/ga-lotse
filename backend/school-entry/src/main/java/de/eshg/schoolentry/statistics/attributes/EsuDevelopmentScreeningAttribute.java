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
      new ValueWithOptionsAttribute(
          "Status Kind",
          "KIND",
          convertToValueOptions(Child.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  GROE(
      new DecimalAttribute(
          "Größe",
          "GROE",
          "m",
          EsuAttributeUtil.createUnknownOption(Integer.toString(UNKNOWN_INTEGER_999)),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  GROE_PERZ(
      new DecimalAttribute(
          "Größe_Perzentile",
          "GROE_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  GEWI(
      new DecimalAttribute(
          "Gewicht",
          "GEWI",
          "kg",
          EsuAttributeUtil.createUnknownOption(Double.toString(UNKNOWN_DECIMAL_99_9)),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  GEWI_PERZ(
      new DecimalAttribute(
          "Gewicht_Perzentile",
          "GEWI_PERZ",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  BMI(
      new DecimalAttribute(
          "BMI", "BMI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  BMI_PERZ(
      new DecimalAttribute(
          "BMI_Perzentile", "BMI_PERZ", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  RRSYS(
      new IntegerAttribute(
          "RR_systolisch",
          "RRSYS",
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RRDIA(
      new IntegerAttribute(
          "RR_diastolisch",
          "RRDIA",
          "mmHG",
          EsuAttributeUtil.createUnknownOption("999"),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  KOERPERCHECK(
      new ValueWithOptionsAttribute(
          "Ergebnis körperliche Untersuchung",
          "KOERPERCHECK",
          convertToValueOptions(PhysicalExaminationResult.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  EZ(
      new ValueWithOptionsAttribute(
          "Ernährungszustand",
          "EZ",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_ERNAEHRUNGSZUSTAND(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Ernährungszustand",
          "RM Ernährungszustand",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  NEU(
      new ValueWithOptionsAttribute(
          "Neuro",
          "NEU",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_NEUROLOGIE(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Neurologie",
          "RM Neurologie",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  AHK(
      new ValueWithOptionsAttribute(
          "Atmung-Herz-Kreislauf",
          "AHK",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_ATMUNG_HERZ_KREISLAUF(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Atmung-Herz-Kreislauf",
          "RM Atmung-Herz-Kreislauf",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DERM(
      new ValueWithOptionsAttribute(
          "Hautzustand",
          "DERM",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_HAUT(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Haut",
          "RM Haut",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  MUSK(
      new ValueWithOptionsAttribute(
          "Muskulatur",
          "MUSK",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_MUSKULATUR_SKELETT(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Muskulatur,Skelett",
          "RM Muskulatur,Skelett",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  ENDO(
      new ValueWithOptionsAttribute(
          "Endo/Stoffwechsel",
          "ENDO",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_ENDO_STOFFW(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Endo/Stoffwechsel",
          "RM Endo/Stoffw.",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  ABD(
      new ValueWithOptionsAttribute(
          "Abdomen",
          "ABD",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_ABDOMEN(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief Abdomen",
          "RM Abdomen",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  HNO(
      new ValueWithOptionsAttribute(
          "Hals-Nasen-Ohren",
          "HNO",
          convertToValueOptions(ExaminationResultFourOptions.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  RM_HNO(
      new ValueWithOptionsAttribute(
          "Rückmeldung Arztbrief HNO",
          "RM HNO",
          convertToValueOptions(DoctorLetterValue.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  HANDCAP(
      new BooleanAttribute(
          "Handicap", "HANDCAP", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  CHKR(
      new BooleanAttribute(
          "chronische Krankheit",
          "CHKR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  DIAGCH1(
      new TextAttribute(
          "Diagnose 1, chron. Krankheit",
          "DIAGCH1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGCH2(
      new TextAttribute(
          "Diagnose 2, chron. Krankheit",
          "DIAGCH2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGCH3(
      new TextAttribute(
          "Diagnose 3, chron. Krankheit",
          "DIAGCH3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  BEHI(
      new BooleanAttribute(
          "Behinderung", "BEHI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  BEHIART(
      new ValueWithOptionsAttribute(
          "Art der Behinderung",
          "BEHIART",
          convertToValueOptions(Disability.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGB1(
      new TextAttribute(
          "Diagnose 1, Behinderung",
          "DIAGB1",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGB2(
      new TextAttribute(
          "Diagnose 2, Behinderung",
          "DIAGB2",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  DIAGB3(
      new TextAttribute(
          "Diagnose 3, Behinderung",
          "DIAGB3",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          false)),

  PSYSOZRISK(
      new BooleanAttribute(
          "Psychosoziales Risiko",
          "PSYSOZRISK",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  FAMILIE(
      new BooleanAttribute(
          "Familie", "Familie", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  NONCOMP(
      new BooleanAttribute(
          "Non-Compliance", "NonComp", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOZIAL(
      new BooleanAttribute(
          "Sozial", "Sozial", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  MIGRATION(
      new BooleanAttribute(
          "Migration", "Migration", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SONSTIGES_RISIKO(
      new BooleanAttribute(
          "Sonstiges Risiko",
          "Sonstiges Risiko",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  MASSN(
      new BooleanAttribute(
          "sozialpädiatrische Leistung",
          "MASSN",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  WSPR(
      new BooleanAttribute(
          "Wiedervorstellung in Sprechstunde",
          "WSPR",
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  SCHB(
      new BooleanAttribute(
          "Schulberatung", "SCHB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  MOTO(
      new BooleanAttribute(
          "Motorikförderung", "MOTO", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  ERZB(
      new BooleanAttribute(
          "Erziehungsberatung", "ERZB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SPRF(
      new BooleanAttribute(
          "Sprachförderung", "SPRF", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  ERNB(
      new BooleanAttribute(
          "Ernährungsberatung", "ERNB", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  IMPF(
      new BooleanAttribute(
          "Impfberatung", "IMPF", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOZD(
      new BooleanAttribute(
          "Sozialdienst", "SOZD", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SOHI(
      new BooleanAttribute(
          "sonstige Hilfen", "SOHI", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  INFO(
      new BooleanAttribute(
          "Infobrief", "INFO", EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT, true)),

  SCHULEMPF(
      new ValueWithOptionsAttribute(
          "Schulempfehlung",
          "SCHULEMPF",
          convertToValueOptions(SchoolRecommendation.values()),
          EsuDevelopmentScreeningAttribute.CATEGORY_S1_RESULT,
          true)),

  MEHR(
      new BooleanAttribute(
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
