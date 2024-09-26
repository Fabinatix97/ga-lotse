/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import static de.eshg.lib.statistics.util.ConvertToValueOptionHelper.convertToValueOptions;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_ANAMNESIS;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_CHILD;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_PROCEDURE_INFOS;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_PROCEDURE_REFERENCE;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_S1_RESULT;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_S1_SOPESS;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_VACCINATION;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.ATTRIBUTE_CATEGORY_VISION_HEARING;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.CONSPICUOUS;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.INCONSPICUOUS;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.UNKNOWN_DECIMAL_99_9;
import static de.eshg.schoolentry.statistics.EsuAttributeUtil.UNKNOWN_INTEGER_999;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.util.AttributeInfo;
import de.eshg.schoolentry.statistics.options.*;
import java.util.List;

// ESPR twice!
public enum EsuAttributes implements AttributeInfo {
  PROCEDURE_ID(
      "Vorgangsreferenz",
      "PROCEDURE_ID",
      false,
      ValueType.PROCEDURE_ID,
      ATTRIBUTE_CATEGORY_PROCEDURE_REFERENCE,
      true),

  CHILD_CENTRAL_FILE_ID(
      "Kind",
      "CHILD_CENTRAL_FILE_ID",
      false,
      ValueType.CENTRAL_FILE_ID,
      ATTRIBUTE_CATEGORY_CHILD,
      true),

  SCHULE("Name der Schule", "SCHULE", false, ValueType.TEXT, ATTRIBUTE_CATEGORY_CHILD, false),

  SCHULNR(
      "Schulnummer Schulamt",
      "SCHULNR",
      true,
      ValueType.TEXT,
      EsuAttributeUtil.createUnknownSingleOption("9999"),
      ATTRIBUTE_CATEGORY_CHILD,
      false),

  WOHND(
      "bei Einreise: in Deutschland seit (Neue Variable ab S1_2023)",
      "WOHND",
      false,
      ValueType.DATE,
      ATTRIBUTE_CATEGORY_CHILD,
      true),

  KIH(
      "Anzahl der im Haushalt lebenden Kinder",
      "KIH",
      true,
      EsuAttributeUtil.createSiblingValueOptions(),
      ATTRIBUTE_CATEGORY_CHILD,
      true),

  KT(
      "Krippe + KT-Besuch  nach Monaten gruppiert",
      "KT",
      true,
      convertToValueOptions(Daycare.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  KISS("Kiss", "KISS", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  VLK("Vorlaufkurs", "VLK", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  GG(
      "Geburtsgewicht",
      "GG",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("9999"),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  SSW_DAUER(
      "Schwangerschaftsdauer regelrecht",
      "SSW_DAUER",
      false,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      false),

  U2E(
      "U2",
      "U2E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U3E(
      "U3",
      "U3E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U4E(
      "U4",
      "U4E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U5E(
      "U5",
      "U5E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U6E(
      "U6",
      "U6E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U7E(
      "U7",
      "U7E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U7A(
      "U7a",
      "U7A",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U8E(
      "U8",
      "U8E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  U9E(
      "U9",
      "U9E",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  FF("Frühförderung", "FF", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  IP("Integrationsplatz", "IP", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  ERGO("Ergotherapie", "ERGO", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  LOGO(
      "Logopädie - Sprachtherapie",
      "LOGO",
      true,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  KG("Krankengymnastik", "KG", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  MIG("Migrationshintergrund", "MIG", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  GEBKI_TEXT(
      "Geburtsland Kind", "GEBKI_Text", true, ValueType.TEXT, ATTRIBUTE_CATEGORY_ANAMNESIS, true),

  GEBKI_LKZ(
      "Geburtsland Kind LKZ",
      "GEBKI_LKZ",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBKI(
      "Geburtsland Kind gruppiert",
      "GEBKI",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAKI_TEXT(
      "Staatsangehörigkeit bei Geburt Kind",
      "STAKI_Text",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAKI_FFM(
      "Staatsangehörigkeit bei Geburt Kind LKZ",
      "STAKI_FFM",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAKI(
      "Staatsangehörigkeit Kind gruppiert",
      "STAKI",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET1_TEXT(
      "Geburtsland des Elternteil 1",
      "GEBET1_Text",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET1_FFM(
      "Geburtsland des Elternteil 1 LKZ",
      "GEBET1_FFM",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET1(
      "Geburtsland des Elternteil 1 gruppiert",
      "GEBET1",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET1_TEXT(
      "Staatsangehörigkeit bei Geburt Elternteil 1",
      "STAET1_Text",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET1_FFM(
      "Staatsangehörigkeit bei Geburt Elternteil 1 LKZ",
      "STAET1_FFM",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET1(
      "Staatsangehörigkeit Elternteil 1 gruppiert",
      "STAET1",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET2_TEXT(
      "Geburtsland des Elternteil 2",
      "GEBET2_Text",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET2_FFM(
      "Geburtsland des Elternteil 2 LKZ",
      "GEBET2_FFM",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  GEBET2(
      "Geburtsland des Elternteil 2 gruppiert",
      "GEBET2",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET2_TEXT(
      "Staatsangehörigkeit bei Geburt Elternteil 2",
      "STAET2_Text",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET2_FFM(
      "Staatsangehörigkeit bei Geburt Elternteil 2 LKZ",
      "STAET2_FFM",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  STAET2(
      "Staatsangehörigkeit Elternteil 2 gruppiert",
      "STAET2",
      true,
      convertToValueOptions(Country.values()),
      ATTRIBUTE_CATEGORY_ANAMNESIS,
      true),

  IMPFBUCH(
      "Impfbuch vorgelegt",
      "ImpfBuch",
      true,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  IMPFSCHEMA(
      "Impfschema \"2+1\" und \"3+1\" ",
      "Impfschema",
      true,
      convertToValueOptions(VaccinationScheme.values()),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  DIP(
      "Impfung Diphtherie Summe",
      "Dip",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  TET(
      "Impfungen Tetanus Summe",
      "Tet",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  PER(
      "Impfungen Pertussis Summe",
      "Per",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  HIB(
      "Impfungen HIB Summe",
      "HIB",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  POL(
      "Impfungen Polio Summe",
      "Pol",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  PERKOMBIHBV(
      "PerkombiHBV",
      "PerkombiHBV",
      true,
      convertToValueOptions(BooleanWithUnknown.values()),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  HBV(
      "Impfungen Hepatitis B Summe",
      "HBV",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  PNEUMO(
      "Impfungen Pneumokokken Summe",
      "Pneumo",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  MMR(
      "Impfungen Maser, Mumps, Röteln Summe",
      "MMR",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  VARI(
      "Impfungen Varizellen Summe",
      "Vari",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  MENB(
      "Impfungen Meningokokken B Summe",
      "MenB",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  MENC(
      "Impfungen Meningokokken C Summe",
      "MenC",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  ROTA(
      "Impfungen Rota Summe",
      "Rota",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  FSME(
      "Impfungen FSME Summe",
      "FSME",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  HAV(
      "Impfungen Hepatitis A Summe",
      "HAV",
      true,
      EsuAttributeUtil.createVaccinationCountOptions(),
      ATTRIBUTE_CATEGORY_VACCINATION,
      true),

  KIND(
      "Status Kind",
      "KIND",
      true,
      convertToValueOptions(Child.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  GROE(
      "Größe",
      "GROE",
      true,
      ValueType.DECIMAL,
      "m",
      EsuAttributeUtil.createUnknownSingleOption(Integer.toString(UNKNOWN_INTEGER_999)),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  GROE_PERZ(
      "Größe_Perzentile",
      "GROE_PERZ",
      false,
      ValueType.DECIMAL,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  GEWI(
      "Gewicht",
      "GEWI",
      true,
      ValueType.DECIMAL,
      "kg",
      EsuAttributeUtil.createUnknownSingleOption(Double.toString(UNKNOWN_DECIMAL_99_9)),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  GEWI_PERZ(
      "Gewicht_Perzentile",
      "GEWI_PERZ",
      false,
      ValueType.DECIMAL,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  BMI("BMI", "BMI", false, ValueType.DECIMAL, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  BMI_PERZ(
      "BMI_Perzentile", "BMI_PERZ", false, ValueType.DECIMAL, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SDS("SDS", "SDS", false, ValueType.DECIMAL, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  RRSYS(
      "RR_systolisch",
      "RRSYS",
      true,
      ValueType.INTEGER,
      "mmHG",
      EsuAttributeUtil.createUnknownSingleOption("999"),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RRDIA(
      "RR_diastolisch",
      "RRDIA",
      true,
      ValueType.INTEGER,
      "mmHG",
      EsuAttributeUtil.createUnknownSingleOption("999"),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  KOERPERCHECK(
      "Ergebnis körperliche Untersuchung",
      "KOERPERCHECK",
      false,
      convertToValueOptions(PhysicalExaminationResult.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  EZ(
      "Ernährungszustand",
      "EZ",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_ERNAEHRUNGSZUSTAND(
      "Rückmeldung Arztbrief Ernährungszustand",
      "RM Ernährungszustand",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  NEU(
      "Neuro",
      "NEU",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_NEUROLOGIE(
      "Rückmeldung Arztbrief Neurologie",
      "RM Neurologie",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  AHK(
      "Atmung-Herz-Kreislauf",
      "AHK",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_ATMUNG_HERZ_KREISLAUF(
      "Rückmeldung Arztbrief Atmung-Herz-Kreislauf",
      "RM Atmung-Herz-Kreislauf",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DERM(
      "Hautzustand",
      "DERM",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_HAUT(
      "Rückmeldung Arztbrief Haut",
      "RM Haut",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  MUSK(
      "Muskulatur",
      "MUSK",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_MUSKULATUR_SKELETT(
      "Rückmeldung Arztbrief Muskulatur,Skelett",
      "RM Muskulatur,Skelett",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  ENDO(
      "Endo/Stoffwechsel",
      "ENDO",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_ENDO_STOFFW(
      "Rückmeldung Arztbrief Endo/Stoffwechsel",
      "RM Endo/Stoffw.",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  ABD(
      "Abdomen",
      "ABD",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_ABDOMEN(
      "Rückmeldung Arztbrief Abdomen",
      "RM Abdomen",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  HNO(
      "Hals-Nasen-Ohren",
      "HNO",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  RM_HNO(
      "Rückmeldung Arztbrief HNO",
      "RM HNO",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  HANDCAP("Handicap", "HANDCAP", false, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  CHKR("chronische Krankheit", "CHKR", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  DIAGCH1(
      "Diagnose 1, chron. Krankheit",
      "DIAGCH1",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DIAGCH2(
      "Diagnose 2, chron. Krankheit",
      "DIAGCH2",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DIAGCH3(
      "Diagnose 3, chron. Krankheit",
      "DIAGCH3",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  BEHI("Behinderung", "BEHI", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  BEHIART(
      "Art der Behinderung",
      "BEHIART",
      true,
      convertToValueOptions(Disability.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DIAGB1(
      "Diagnose 1, Behinderung",
      "DIAGB1",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DIAGB2(
      "Diagnose 2, Behinderung",
      "DIAGB2",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  DIAGB3(
      "Diagnose 3, Behinderung",
      "DIAGB3",
      true,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      false),

  PSYSOZRISK(
      "Psychosoziales Risiko",
      "PSYSOZRISK",
      false,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  FAMILIE("Familie", "Familie", false, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  NONCOMP(
      "Non-Compliance", "NonComp", false, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SOZIAL("Sozial", "Sozial", false, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  MIGRATION("Migration", "Migration", false, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SONSTIGES_RISIKO(
      "Sonstiges Risiko",
      "Sonstiges Risiko",
      false,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  MASSN(
      "sozialpädiatrische Leistung",
      "MASSN",
      true,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  WSPR(
      "Wiedervorstellung in Sprechstunde",
      "WSPR",
      true,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  SCHB("Schulberatung", "SCHB", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  MOTO("Motorikförderung", "MOTO", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  ERZB("Erziehungsberatung", "ERZB", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SPRF("Sprachförderung", "SPRF", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  ERNB("Ernährungsberatung", "ERNB", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  IMPF("Impfberatung", "IMPF", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SOZD("Sozialdienst", "SOZD", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SOHI("sonstige Hilfen", "SOHI", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  INFO("Infobrief", "INFO", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  SCHULEMPF(
      "Schulempfehlung",
      "SCHULEMPF",
      true,
      convertToValueOptions(SchoolRecommendation.values()),
      ATTRIBUTE_CATEGORY_S1_RESULT,
      true),

  MEHR("Mehraufwand", "MEHR", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_S1_RESULT, true),

  VISCH(
      "Ergebnis Sehscreening",
      "VISCH",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      true),

  KW_RM_VISUS(
      "Rückmeldung Arztbrief Sehscreening",
      "KW_RM_VISUS",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_AMBLYOPIE(
      "Diagnose Rückmeldung Amblyopie",
      "KW_AMBLYOPIE",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      true),

  KW_ASTIGMATISMUS(
      "Diagnose Rückmeldung Astigmatismus",
      "KW_ASTIGMATISMUS",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_STOER_FARBS(
      "Diagnose Rückmeldung Farbsinnstörung",
      "KW_STOER_FARBS",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_HYPEROPIE(
      "Diagnose Rückmeldung Hyperopie",
      "KW_HYPEROPIE",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_MYOPIE(
      "Diagnose Rückmeldung Myopie",
      "KW_MYOPIE",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_STRABISM(
      "Diagnose Rückmeldung Strabismus",
      "KW_STRABISM",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KW_AND_DIAGN(
      "Diagnose Rückmeldung andere Diagnose",
      "KW_AND_DIAGN",
      false,
      convertToValueOptions(Diagnosis.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  VISTR(
      "Ergebnis Stereosehen, Langtest",
      "VISTR",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      true),

  KW_RM_VISTR(
      "Rückmeldung Arztbrief Stereosehen",
      "KW_RM_VISTR",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  FARB(
      "Ergebnis Ishiharatest Farbsinn",
      "FARB",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      true),

  KW_RM_FARB(
      "Rückmeldung Arztbrief Farbsinn",
      "KW_RM_FARB",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  AUDIO(
      "Ergebnis Hörscreening",
      "AUDIO",
      true,
      convertToValueOptions(ExaminationResultFourOptions.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      true),

  KW_RM_AUDIO(
      "Rückmeldung Arztbrief Hörscreening",
      "KW_RM_AUDIO",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_VISION_HEARING,
      false),

  KOORD(
      "Körperkoordination (Sprungzahl)",
      "KOORD",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KOORD1(
      "Körperkoordniation Bewertung",
      "KOORD1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  GROMO(
      "Ergebnis Grobmotorik",
      "GROMO",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_GROMO(
      "Rückmeldung Arztbrief Grobmotorik",
      "KW_RM_GROMO",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  VISMOT(
      "Visuomotorik",
      "VISMOT",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  VISMOT1(
      "Visuomotorik Bewertung",
      "VISMOT1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  FEIMO(
      "Ergebnis Feinmotorik",
      "FEIMO",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_FEIMO(
      "Rückmeldung Arztbrief Feinmotorik",
      "KW_RM_FEIMO",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  HAND(
      "Händigkeit",
      "HAND",
      false,
      convertToValueOptions(Hand.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  VISPER(
      "Visuelle Perzeption",
      "VISPER",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  VISPER1(
      "Visuelle Perzeption Bewertung",
      "VISPER1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  VISWA(
      "Ergebnis Visuelle Wahrnehmung",
      "VISWA",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_VISWA(
      "Rückmeldung Arztbrief Visuelle Wahrnehmung",
      "KW_RM_VISWA",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  ESPR(
      "Erstsprache Kind",
      "ESPR",
      true,
      convertToValueOptions(FirstLanguage.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  FAMSPR(
      "Familiensprache",
      "FAMSPR",
      true,
      convertToValueOptions(Language.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  SPRBP(
      "Sprachkenntnisse Hauptbezugsperson",
      "SPRBP",
      true,
      convertToValueOptions(GuardianLanguageKnowledge.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  SPRDEU(
      "Sprachkenntnisse Kind",
      "SPRDEU",
      true,
      convertToValueOptions(ChildLanguageKnowledge.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_S_Z(
      "Artikulation/ Dyslalie Buchstaben S + Z",
      "DYS_S_Z",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_SCH(
      "Artikulation/ Dyslalie Lautbildung SCH",
      "DYS_SCH",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_T_D(
      "Artikulation/ Dyslalie Buchstaben T + D",
      "DYS_T_D",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_CH(
      "Artikulation/ Dyslalie Lautbildung CH",
      "DYS_CH",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_G_K(
      "Artikulation/ Dyslalie Buchstaben G + K",
      "DYS_G_K",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_L_N(
      "Artikulation/ Dyslalie Buchstaben L + N",
      "DYS_L_N",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_R(
      "Artikulation/ Dyslalie Buchstabe R",
      "DYS_R",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_F_PF(
      "Artikulation/ Dyslalie Buchstabe F, Lautbildung PF",
      "DYS_F_PF",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_B(
      "Artikulation/ Dyslalie Buchstabe B",
      "DYS_B",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS_TR_DR_KR_GR(
      "Artikulation/ Dyslalie Lautbildung tr, dr, kr + gr",
      "DYS_tr_dr_kr_gr",
      false,
      convertToValueOptions(Articulation.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS(
      "Ergebnis (Summe - Punkte) Artikulation, Dyslalie",
      "DYS",
      true,
      EsuAttributeUtil.createDyslaliaOptions(),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  DYS1(
      "Artikulation, Dyslalie Bewertung",
      "DYS1",
      false,
      List.of(
          new ValueOptionInternal("A", CONSPICUOUS, false),
          new ValueOptionInternal("U", INCONSPICUOUS, false)),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  SPR(
      "Ergebnis Sprache",
      "SPR",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_SPR(
      "Rückmeldung Arztbrief Sprache",
      "KW_RM_SPR",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  PSWOE(
      "Pseudowörter",
      "PSWOE",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("9"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PSWOE1(
      "Pseudowörter Bewertung",
      "PSWOE1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PRAEP(
      "Präpositionen",
      "PRAEP",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("9"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PRAEP1(
      "Präpositionen Bewertung",
      "PRAEP1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PLUR(
      "Plurale",
      "PLUR",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("9"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PLUR1(
      "Plurale Bewertung",
      "PLUR1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  AUDWA(
      "Ergebnis Auditive Infoverarbeitung",
      "AUDWA",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_AUSWA(
      "Rückmeldung Arztbrief Auditive Infoverarbeitung",
      "KW_RM_AUSWA",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  ZAEHL(
      "Zählen",
      "ZAEHL",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  ZAEHL1(
      "Zählen Bewertung",
      "ZAEHL1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  MENG(
      "Mengenvorwissen",
      "MENG",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  MENG1(
      "Mengenvorwissen Bewertung",
      "MENG1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  WISSDE(
      "Ergebnis Wissen/ Denken",
      "WISSDE",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_WISSDE(
      "Rückmeldung Arztbrief Wissen/ Denken",
      "KW_RM_WISSDE",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  SELAUFM(
      "Selektive Aufmerksamkeit",
      "SELAUFM",
      true,
      ValueType.INTEGER,
      EsuAttributeUtil.createUnknownSingleOption("99"),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  SELAUFM1(
      "Selektive Aufmerksamkeit Bewertung",
      "SELAUFM1",
      false,
      convertToValueOptions(EvaluationResult.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  PSYVER(
      "Ergebnis psychisches Verhalten",
      "PSYVER",
      true,
      convertToValueOptions(ExaminationResultFiveOptions.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      true),

  KW_RM_PSYVER(
      "Rückmeldung Arztbrief psychisches Verhalten",
      "KW_RM_PSYVER",
      false,
      convertToValueOptions(DoctorLetterValue.values()),
      ATTRIBUTE_CATEGORY_S1_SOPESS,
      false),

  UNTERSDAT(
      "Untersuchungsdatum",
      "UntersDat",
      true,
      ValueType.DATE,
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true),

  TEAM_EIGENSCHAFT(
      "zuständiges Team",
      "TEAM_EIGENSCHAFT",
      false,
      EsuAttributeUtil.createTeamOptions(),
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true),

  TEAM(
      "untersuchendes Team",
      "TEAM",
      false,
      EsuAttributeUtil.createTeamOptions(),
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true),

  ARZT(
      "untersuchender Arzt",
      "ARZT",
      true,
      ValueType.TEXT,
      null,
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true),

  ASSU(
      "untersuchende:r MFA",
      "ASSU",
      true,
      ValueType.TEXT,
      null,
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true),

  ASSD("Assistent", "ASSD", true, ValueType.TEXT, null, ATTRIBUTE_CATEGORY_PROCEDURE_INFOS, true),

  KENNUNG(
      "Kennzeichnung Akte",
      "Kennung",
      false,
      ValueType.TEXT,
      ATTRIBUTE_CATEGORY_PROCEDURE_INFOS,
      true);

  private final String name;

  private final String code;

  private final boolean accessibleForCountyOffice;

  private final ValueType type;

  private final String unit;

  private final List<ValueOptionInternal> valueOptions;
  private final String category;
  private final boolean mandatory;

  EsuAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      String category,
      boolean mandatory) {
    this(name, code, accessibleForCountyOffice, type, null, null, category, mandatory);
  }

  EsuAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this(name, code, accessibleForCountyOffice, type, null, valueOptions, category, mandatory);
  }

  EsuAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this(
        name,
        code,
        accessibleForCountyOffice,
        ValueType.VALUE_WITH_OPTIONS,
        null,
        valueOptions,
        category,
        mandatory);
  }

  EsuAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      String unit,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.accessibleForCountyOffice = accessibleForCountyOffice;
    this.type = type;
    this.unit = unit;
    this.valueOptions = valueOptions;
    this.category = category;
    this.mandatory = mandatory;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public boolean isAccessibleForCountyOffice() {
    return accessibleForCountyOffice;
  }

  @Override
  public ValueType getType() {
    return type;
  }

  @Override
  public String getUnit() {
    return unit;
  }

  @Override
  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  @Override
  public String getCategory() {
    return category;
  }

  @Override
  public boolean isMandatory() {
    return mandatory;
  }
}
