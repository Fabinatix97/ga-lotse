/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.domain.model.*;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class ExaminationResultMapper {

  private ExaminationResultMapper() {}

  private static ExaminationResultValue mapToDomain(ExaminationResultValueDto resultValueDto) {
    return switch (resultValueDto) {
      case null -> null;
      case OK -> ExaminationResultValue.OK;
      case KNOWN -> ExaminationResultValue.KNOWN;
      case DOCTOR_LETTER -> ExaminationResultValue.DOCTOR_LETTER;
      case UNKNOWN -> ExaminationResultValue.UNKNOWN;
    };
  }

  private static DoctorLetterValue mapToDomain(DoctorLetterValueDto doctorLetterValueDto) {
    return switch (doctorLetterValueDto) {
      case null -> null;
      case NO_REPLY -> DoctorLetterValue.NO_REPLY;
      case CONFIRMED -> DoctorLetterValue.CONFIRMED;
      case PARTIALLY_CONFIRMED -> DoctorLetterValue.PARTIALLY_CONFIRMED;
      case NOT_CONFIRMED -> DoctorLetterValue.NOT_CONFIRMED;
    };
  }

  private static HandednessValue mapToDomain(HandednessValueDto dto) {
    return switch (dto) {
      case null -> null;
      case RIGHT -> HandednessValue.RIGHT;
      case LEFT -> HandednessValue.LEFT;
      case UNCERTAIN -> HandednessValue.UNCERTAIN;
      case UNKNOWN -> HandednessValue.UNKNOWN;
    };
  }

  private static PrimaryLanguageValue mapToDomain(PrimaryLanguageValueDto dto) {
    return switch (dto) {
      case null -> null;
      case GERMAN -> PrimaryLanguageValue.GERMAN;
      case OTHER -> PrimaryLanguageValue.OTHER;
      case OTHER_AND_GERMAN -> PrimaryLanguageValue.OTHER_AND_GERMAN;
      case MULTIPLE_OTHER -> PrimaryLanguageValue.MULTIPLE_OTHER;
      case UNKNOWN -> PrimaryLanguageValue.UNKNOWN;
    };
  }

  private static LanguageKnowledgeValue mapToDomain(LanguageKnowledgeValueDto dto) {
    return switch (dto) {
      case null -> null;
      case RUDIMENTARY -> LanguageKnowledgeValue.RUDIMENTARY;
      case FAULTY -> LanguageKnowledgeValue.FAULTY;
      case FAULTLESS -> LanguageKnowledgeValue.FAULTLESS;
      case UNKNOWN -> LanguageKnowledgeValue.UNKNOWN;
    };
  }

  private static FamilyLanguageValue mapToDomain(FamilyLanguageValueDto dto) {
    return switch (dto) {
      case null -> null;
      case GERMAN -> FamilyLanguageValue.GERMAN;
      case TURKISH -> FamilyLanguageValue.TURKISH;
      case KURDISH -> FamilyLanguageValue.KURDISH;
      case RUSSIAN -> FamilyLanguageValue.RUSSIAN;
      case POLISH -> FamilyLanguageValue.POLISH;
      case ARABIC -> FamilyLanguageValue.ARABIC;
      case FARSI_DARI -> FamilyLanguageValue.FARSI_DARI;
      case SERBO_CROATIAN -> FamilyLanguageValue.SERBO_CROATIAN;
      case ROMAN -> FamilyLanguageValue.ROMAN;
      case BULGARIAN -> FamilyLanguageValue.BULGARIAN;
      case PASHTU -> FamilyLanguageValue.PASHTU;
      case TIGRINIA -> FamilyLanguageValue.TIGRINIA;
      case BERBERIAN -> FamilyLanguageValue.BERBERIAN;
      case AMHARIAN -> FamilyLanguageValue.AMHARIAN;
      case ARAMEAN -> FamilyLanguageValue.ARAMEAN;
      case ITALIAN -> FamilyLanguageValue.ITALIAN;
      case SPANISH -> FamilyLanguageValue.SPANISH;
      case GREEK -> FamilyLanguageValue.GREEK;
      case PORTUGUESE -> FamilyLanguageValue.PORTUGUESE;
      case ENGLISH -> FamilyLanguageValue.ENGLISH;
      case FRENCH -> FamilyLanguageValue.FRENCH;
      case URDU -> FamilyLanguageValue.URDU;
      case OTHER_EUROPEAN_LANGUAGES -> FamilyLanguageValue.OTHER_EUROPEAN_LANGUAGES;
      case OTHER_ASIAN_LANGUAGES -> FamilyLanguageValue.OTHER_ASIAN_LANGUAGES;
      case OTHER_AFRICAN_LANGUAGES -> FamilyLanguageValue.OTHER_AFRICAN_LANGUAGES;
      case OTHER_LANGUAGES -> FamilyLanguageValue.OTHER_LANGUAGES;
      case UNKNOWN -> FamilyLanguageValue.UNKNOWN;
    };
  }

  private static GermanKnowledgeValue mapToDomain(GermanKnowledgeValueDto dto) {
    return switch (dto) {
      case null -> null;
      case NO_GERMAN -> GermanKnowledgeValue.NO_GERMAN;
      case BAD -> GermanKnowledgeValue.BAD;
      case FLUID_WITH_MAJOR_ERRORS -> GermanKnowledgeValue.FLUID_WITH_MAJOR_ERRORS;
      case FLUID_WITH_MINOR_ERRORS -> GermanKnowledgeValue.FLUID_WITH_MINOR_ERRORS;
      case FAULTLESS -> GermanKnowledgeValue.FAULTLESS;
      case UNKNOWN -> GermanKnowledgeValue.UNKNOWN;
    };
  }

  private static ArticulationValue mapToDomain(ArticulationValueDto dto) {
    return switch (dto) {
      case null -> null;
      case INCONSPICUOUS -> ArticulationValue.INCONSPICUOUS;
      case CONSPICUOUS -> ArticulationValue.CONSPICUOUS;
      case UNKNOWN -> ArticulationValue.UNKNOWN;
    };
  }

  private static ExaminationResult mapToDomain(ExaminationResultDto examinationResultDto) {
    if (examinationResultDto == null) {
      return null;
    }
    ExaminationResult examination = new ExaminationResult();
    examination.setValue(mapToDomain(examinationResultDto.examinationResultValue()));
    examination.setDoctorLetter(mapToDomain(examinationResultDto.doctorLetterValue()));
    return examination;
  }

  private static DecibelValue mapToDomain(DecibelValueDto decibelValueDto) {
    return switch (decibelValueDto) {
      case null -> null;
      case DB_20 -> DecibelValue.DB_20;
      case DB_30 -> DecibelValue.DB_30;
      case DB_40 -> DecibelValue.DB_40;
      case DB_50 -> DecibelValue.DB_50;
      case DB_60 -> DecibelValue.DB_60;
    };
  }

  private static HearingTestValues mapHearingTestValuesToDomain(
      Map<HertzValueDto, DecibelValueDto> values) {
    if (values == null) {
      return null;
    }
    HearingTestValues result = new HearingTestValues();
    result.setHz250(mapToDomain(values.get(HertzValueDto.HZ_250)));
    result.setHz500(mapToDomain(values.get(HertzValueDto.HZ_500)));
    result.setHz1000(mapToDomain(values.get(HertzValueDto.HZ_1000)));
    result.setHz2000(mapToDomain(values.get(HertzValueDto.HZ_2000)));
    result.setHz4000(mapToDomain(values.get(HertzValueDto.HZ_4000)));
    result.setHz6000(mapToDomain(values.get(HertzValueDto.HZ_6000)));
    result.setHz8000(mapToDomain(values.get(HertzValueDto.HZ_8000)));
    return result;
  }

  public static HearingTestResult mapToDomain(HearingTestResultDto hearingTestResultDto) {
    if (hearingTestResultDto == null) {
      return null;
    }
    HearingTestResult result = new HearingTestResult();
    result.setLeftEar(mapHearingTestValuesToDomain(hearingTestResultDto.leftEar()));
    result.setRightEar(mapHearingTestValuesToDomain(hearingTestResultDto.rightEar()));
    result.setExaminationResult(mapToDomain(hearingTestResultDto.examinationResult()));
    result.setNote(hearingTestResultDto.note());
    return result;
  }

  private static PercentageValue mapToDomain(PercentageValueDto percentageValueDto) {
    return switch (percentageValueDto) {
      case null -> null;
      case PERCENTAGE_LT_15 -> PercentageValue.PERCENTAGE_LT_15;
      case PERCENTAGE_15 -> PercentageValue.PERCENTAGE_15;
      case PERCENTAGE_30 -> PercentageValue.PERCENTAGE_30;
      case PERCENTAGE_50 -> PercentageValue.PERCENTAGE_50;
      case PERCENTAGE_70 -> PercentageValue.PERCENTAGE_70;
      case PERCENTAGE_100 -> PercentageValue.PERCENTAGE_100;
    };
  }

  private static EyeExaminationValues mapEyeExaminationValuesToDomain(
      Map<EyeExaminationTypeDto, PercentageValueDto> values) {
    if (values == null) {
      return null;
    }
    EyeExaminationValues result = new EyeExaminationValues();
    result.setDistance(mapToDomain(values.get(EyeExaminationTypeDto.DISTANCE)));
    result.setDistancePlus150Dpt(
        mapToDomain(values.get(EyeExaminationTypeDto.DISTANCE_PLUS_15DPT)));
    result.setDistanceWithGlasses(
        mapToDomain(values.get(EyeExaminationTypeDto.DISTANCE_WITH_GLASSES)));
    return result;
  }

  public static EyeExaminationResult mapToDomain(EyeExaminationResultDto eyeExaminationResultDto) {
    if (eyeExaminationResultDto == null) {
      return null;
    }
    EyeExaminationResult result = new EyeExaminationResult();
    result.setLeftEye(mapEyeExaminationValuesToDomain(eyeExaminationResultDto.leftEye()));
    result.setRightEye(mapEyeExaminationValuesToDomain(eyeExaminationResultDto.rightEye()));
    result.setEyeExamination(mapToDomain(eyeExaminationResultDto.eyeExamination()));
    result.setLangExamination(mapToDomain(eyeExaminationResultDto.langExamination()));
    result.setIshiharaExamination(mapToDomain(eyeExaminationResultDto.ishiharaExamination()));
    result.setAmblyopia(eyeExaminationResultDto.amblyopia());
    result.setAstigmatism(eyeExaminationResultDto.astigmatism());
    result.setColorVisionDisorder(eyeExaminationResultDto.colorVisionDisorder());
    result.setHyperopia(eyeExaminationResultDto.hyperopia());
    result.setMyopia(eyeExaminationResultDto.myopia());
    result.setStrabismus(eyeExaminationResultDto.strabismus());
    result.setOtherDiagnosis(eyeExaminationResultDto.otherDiagnosis());
    result.setNote(eyeExaminationResultDto.note());
    return result;
  }

  public static SopessExaminationResult mapToDomain(SopessExaminationResultDto dto) {
    if (dto == null) {
      return null;
    }
    SopessExaminationResult result = new SopessExaminationResult();

    ScoredEvaluationExaminationDto grossMotorSkills = dto.getGrossMotorSkills();
    result.setJumpCount(grossMotorSkills.points());
    result.setGrossMotorSkills(mapToDomain(grossMotorSkills.evaluation().examinationResultValue()));
    result.setDoctorLetterGrossMotorSkills(
        mapToDomain(grossMotorSkills.evaluation().doctorLetterValue()));

    ScoredEvaluationExaminationDto fineMotorSkills = dto.getFineMotorSkills();
    result.setVisuoMotor(fineMotorSkills.points());
    result.setFineMotorSkills(mapToDomain(fineMotorSkills.evaluation().examinationResultValue()));
    result.setDoctorLetterFineMotorSkills(
        mapToDomain(fineMotorSkills.evaluation().doctorLetterValue()));

    result.setHandednessValue(mapToDomain(dto.getHandedness()));

    ScoredEvaluationExaminationDto visualPerceptionResult = dto.getVisualPerceptionResult();
    result.setVisualPerceptionPoints(visualPerceptionResult.points());
    result.setVisualPerceptionResult(
        mapToDomain(visualPerceptionResult.evaluation().examinationResultValue()));
    result.setDoctorLetterVisualPerception(
        mapToDomain(visualPerceptionResult.evaluation().doctorLetterValue()));

    SopessLanguageDto language = dto.getLanguage();
    result.setPrimaryLanguage(mapToDomain(language.primaryLanguage()));
    result.setGermanKnowledgePrimaryCarer(mapToDomain(language.germanKnowledgePrimaryCarer()));
    result.setFamilyLanguage(mapToDomain(language.familyLanguage()));
    result.setGermanKnowledgeChild(mapToDomain(language.germanKnowledgeChild()));
    result.setInGermanySince(language.inGermanySince());

    ArticulationDto articulation = dto.getArticulation();
    result.setLettersSAndZPoints(mapToDomain(articulation.lettersSAndZPoints()));
    result.setFormationSchPoints(mapToDomain(articulation.formationSchPoints()));
    result.setLettersTAndDPoints(mapToDomain(articulation.lettersTAndDPoints()));
    result.setFormationChPoints(mapToDomain(articulation.formationChPoints()));
    result.setLettersGAndKPoints(mapToDomain(articulation.lettersGAndKPoints()));
    result.setLettersLAndNPoints(mapToDomain(articulation.lettersLAndNPoints()));
    result.setLetterRPoints(mapToDomain(articulation.letterRPoints()));
    result.setLetterFAndFormationPfPoints(mapToDomain(articulation.letterFAndFormationPfPoints()));
    result.setLetterBPoints(mapToDomain(articulation.letterBPoints()));
    result.setFormationsTrDrKrGrPoints(mapToDomain(articulation.formationsTrDrKrGrPoints()));

    SpeechEvaluationExaminationDto speechEvaluationExamination = dto.getSpeechResult();
    EvaluationExaminationDto speechResult = speechEvaluationExamination.evaluation();
    result.setPrepositionPoints(speechEvaluationExamination.prepositionPoints());
    result.setPluralPoints(speechEvaluationExamination.pluralPoints());
    result.setSpeechResult(mapToDomain(speechResult.examinationResultValue()));
    result.setDoctorLetterSpeech(mapToDomain(speechResult.doctorLetterValue()));

    ScoredEvaluationExaminationDto auditiveProcessingResult = dto.getAuditiveProcessingResult();
    result.setPseudowordPoints(auditiveProcessingResult.points());
    result.setAuditiveProcessingResult(
        mapToDomain(auditiveProcessingResult.evaluation().examinationResultValue()));
    result.setDoctorLetterAuditiveProcessing(
        mapToDomain(auditiveProcessingResult.evaluation().doctorLetterValue()));

    KnowledgeThinkingExaminationDto knowledgeThinkingExamination = dto.getKnowledgeThinkingResult();
    EvaluationExaminationDto knowledgeThinkingResult = knowledgeThinkingExamination.evaluation();
    result.setCountingPoints(knowledgeThinkingExamination.countingPoints());
    result.setQuantityKnowledgePoints(knowledgeThinkingExamination.quantityKnowledgePoints());
    result.setKnowledgeThinkingResult(
        mapToDomain(knowledgeThinkingResult.examinationResultValue()));
    result.setDoctorLetterKnowledgeThinking(
        mapToDomain(knowledgeThinkingResult.doctorLetterValue()));

    ScoredEvaluationExaminationDto psychologicalBehaviorResult =
        dto.getPsychologicalBehaviorResult();
    result.setSelectiveAttentionPoints(psychologicalBehaviorResult.points());
    result.setPsychologicalBehaviorResult(
        mapToDomain(psychologicalBehaviorResult.evaluation().examinationResultValue()));
    result.setDoctorLetterPsychologicalBehavior(
        mapToDomain(psychologicalBehaviorResult.evaluation().doctorLetterValue()));

    result.setNote(dto.getNote());

    return result;
  }

  private static SopessExaminationResultValue mapToDomain(SopessExaminationResultValueDto dto) {
    return switch (dto) {
      case null -> null;
      case DOCTOR_LETTER -> SopessExaminationResultValue.DOCTOR_LETTER;
      case KNOWN -> SopessExaminationResultValue.KNOWN;
      case BORDERLINE -> SopessExaminationResultValue.BORDERLINE;
      case OK -> SopessExaminationResultValue.OK;
      case UNKNOWN -> SopessExaminationResultValue.UNKNOWN;
    };
  }

  private static ExaminationResultValueDto mapToDto(ExaminationResultValue resultValue) {
    return switch (resultValue) {
      case null -> null;
      case OK -> ExaminationResultValueDto.OK;
      case KNOWN -> ExaminationResultValueDto.KNOWN;
      case DOCTOR_LETTER -> ExaminationResultValueDto.DOCTOR_LETTER;
      case UNKNOWN -> ExaminationResultValueDto.UNKNOWN;
    };
  }

  private static DoctorLetterValueDto mapToDto(DoctorLetterValue doctorLetterValue) {
    return switch (doctorLetterValue) {
      case null -> null;
      case NO_REPLY -> DoctorLetterValueDto.NO_REPLY;
      case CONFIRMED -> DoctorLetterValueDto.CONFIRMED;
      case PARTIALLY_CONFIRMED -> DoctorLetterValueDto.PARTIALLY_CONFIRMED;
      case NOT_CONFIRMED -> DoctorLetterValueDto.NOT_CONFIRMED;
    };
  }

  private static ExaminationResultDto mapToDto(ExaminationResult examinationResult) {
    if (examinationResult == null) {
      return new ExaminationResultDto();
    }
    return new ExaminationResultDto(
        mapToDto(examinationResult.getValue()), mapToDto(examinationResult.getDoctorLetter()));
  }

  private static DecibelValueDto mapToDto(DecibelValue decibelValue) {
    return switch (decibelValue) {
      case null -> null;
      case DB_20 -> DecibelValueDto.DB_20;
      case DB_30 -> DecibelValueDto.DB_30;
      case DB_40 -> DecibelValueDto.DB_40;
      case DB_50 -> DecibelValueDto.DB_50;
      case DB_60 -> DecibelValueDto.DB_60;
    };
  }

  private static Map<HertzValueDto, DecibelValueDto> mapToDto(HearingTestValues values) {
    LinkedHashMap<HertzValueDto, DecibelValueDto> result = new LinkedHashMap<>();
    if (values == null) {
      return result;
    }
    result.put(HertzValueDto.HZ_250, mapToDto(values.getHz250()));
    result.put(HertzValueDto.HZ_500, mapToDto(values.getHz500()));
    result.put(HertzValueDto.HZ_1000, mapToDto(values.getHz1000()));
    result.put(HertzValueDto.HZ_2000, mapToDto(values.getHz2000()));
    result.put(HertzValueDto.HZ_4000, mapToDto(values.getHz4000()));
    result.put(HertzValueDto.HZ_6000, mapToDto(values.getHz6000()));
    result.put(HertzValueDto.HZ_8000, mapToDto(values.getHz8000()));

    return result;
  }

  public static HearingTestResultDto mapToDto(HearingTestResult hearingTestResult) {
    if (hearingTestResult == null) {
      return null;
    }
    return new HearingTestResultDto(
        hearingTestResult.getVersion(),
        mapToDto(hearingTestResult.getLeftEar()),
        mapToDto(hearingTestResult.getRightEar()),
        mapToDto(hearingTestResult.getExaminationResult()),
        hearingTestResult.getNote());
  }

  private static PercentageValueDto mapToDto(PercentageValue value) {
    return switch (value) {
      case null -> null;
      case PERCENTAGE_LT_15 -> PercentageValueDto.PERCENTAGE_LT_15;
      case PERCENTAGE_15 -> PercentageValueDto.PERCENTAGE_15;
      case PERCENTAGE_30 -> PercentageValueDto.PERCENTAGE_30;
      case PERCENTAGE_50 -> PercentageValueDto.PERCENTAGE_50;
      case PERCENTAGE_70 -> PercentageValueDto.PERCENTAGE_70;
      case PERCENTAGE_100 -> PercentageValueDto.PERCENTAGE_100;
    };
  }

  private static Map<EyeExaminationTypeDto, PercentageValueDto> mapToDto(
      EyeExaminationValues values) {
    LinkedHashMap<EyeExaminationTypeDto, PercentageValueDto> result = new LinkedHashMap<>();
    if (values == null) {
      return result;
    }
    result.put(EyeExaminationTypeDto.DISTANCE, mapToDto(values.getDistance()));
    result.put(EyeExaminationTypeDto.DISTANCE_PLUS_15DPT, mapToDto(values.getDistancePlus150Dpt()));
    result.put(
        EyeExaminationTypeDto.DISTANCE_WITH_GLASSES, mapToDto(values.getDistanceWithGlasses()));
    return result;
  }

  public static EyeExaminationResultDto mapToDto(EyeExaminationResult eyeExaminationResult) {
    if (eyeExaminationResult == null) {
      return null;
    }
    return new EyeExaminationResultDto(
        eyeExaminationResult.getVersion(),
        mapToDto(eyeExaminationResult.getLeftEye()),
        mapToDto(eyeExaminationResult.getRightEye()),
        mapToDto(eyeExaminationResult.getEyeExamination()),
        mapToDto(eyeExaminationResult.getLangExamination()),
        mapToDto(eyeExaminationResult.getIshiharaExamination()),
        eyeExaminationResult.getAmblyopia(),
        eyeExaminationResult.getAstigmatism(),
        eyeExaminationResult.getColorVisionDisorder(),
        eyeExaminationResult.getHyperopia(),
        eyeExaminationResult.getMyopia(),
        eyeExaminationResult.getStrabismus(),
        eyeExaminationResult.getOtherDiagnosis(),
        eyeExaminationResult.getNote());
  }

  public static SopessExaminationResultDto mapToDto(
      SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }
    SopessExaminationResultDto dto = new SopessExaminationResultDto();
    dto.setVersion(sopessExaminationResult.getVersion());
    dto.setGrossMotorSkills(
        new ScoredEvaluationExaminationDto(
            sopessExaminationResult.getJumpCount(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getGrossMotorSkills()),
                mapToDto(sopessExaminationResult.getDoctorLetterGrossMotorSkills()))));
    dto.setFineMotorSkills(
        new ScoredEvaluationExaminationDto(
            sopessExaminationResult.getVisuoMotor(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getFineMotorSkills()),
                mapToDto(sopessExaminationResult.getDoctorLetterFineMotorSkills()))));
    dto.setHandedness(mapToDto(sopessExaminationResult.getHandednessValue()));
    dto.setVisualPerceptionResult(
        new ScoredEvaluationExaminationDto(
            sopessExaminationResult.getVisualPerceptionPoints(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getVisualPerceptionResult()),
                mapToDto(sopessExaminationResult.getDoctorLetterVisualPerception()))));
    dto.setLanguage(
        new SopessLanguageDto(
            mapToDto(sopessExaminationResult.getPrimaryLanguage()),
            mapToDto(sopessExaminationResult.getGermanKnowledgePrimaryCarer()),
            mapToDto(sopessExaminationResult.getFamilyLanguage()),
            mapToDto(sopessExaminationResult.getGermanKnowledgeChild()),
            sopessExaminationResult.getInGermanySince()));
    dto.setArticulation(
        new ArticulationDto(
            mapToDto(sopessExaminationResult.getLettersSAndZPoints()),
            mapToDto(sopessExaminationResult.getFormationSchPoints()),
            mapToDto(sopessExaminationResult.getLettersTAndDPoints()),
            mapToDto(sopessExaminationResult.getFormationChPoints()),
            mapToDto(sopessExaminationResult.getLettersGAndKPoints()),
            mapToDto(sopessExaminationResult.getLettersLAndNPoints()),
            mapToDto(sopessExaminationResult.getLetterRPoints()),
            mapToDto(sopessExaminationResult.getLetterFAndFormationPfPoints()),
            mapToDto(sopessExaminationResult.getLetterBPoints()),
            mapToDto(sopessExaminationResult.getFormationsTrDrKrGrPoints())));
    dto.setSpeechResult(
        new SpeechEvaluationExaminationDto(
            sopessExaminationResult.getPrepositionPoints(),
            sopessExaminationResult.getPluralPoints(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getSpeechResult()),
                mapToDto(sopessExaminationResult.getDoctorLetterSpeech()))));
    dto.setAuditiveProcessingResult(
        new ScoredEvaluationExaminationDto(
            sopessExaminationResult.getPseudowordPoints(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getAuditiveProcessingResult()),
                mapToDto(sopessExaminationResult.getDoctorLetterAuditiveProcessing()))));
    dto.setKnowledgeThinkingResult(
        new KnowledgeThinkingExaminationDto(
            sopessExaminationResult.getCountingPoints(),
            sopessExaminationResult.getQuantityKnowledgePoints(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getKnowledgeThinkingResult()),
                mapToDto(sopessExaminationResult.getDoctorLetterKnowledgeThinking()))));
    dto.setPsychologicalBehaviorResult(
        new ScoredEvaluationExaminationDto(
            sopessExaminationResult.getSelectiveAttentionPoints(),
            new EvaluationExaminationDto(
                mapToDto(sopessExaminationResult.getPsychologicalBehaviorResult()),
                mapToDto(sopessExaminationResult.getDoctorLetterPsychologicalBehavior()))));
    dto.setNote(sopessExaminationResult.getNote());

    return dto;
  }

  private static SopessExaminationResultValueDto mapToDto(
      SopessExaminationResultValue examinationResult) {
    return switch (examinationResult) {
      case null -> null;
      case DOCTOR_LETTER -> SopessExaminationResultValueDto.DOCTOR_LETTER;
      case KNOWN -> SopessExaminationResultValueDto.KNOWN;
      case BORDERLINE -> SopessExaminationResultValueDto.BORDERLINE;
      case OK -> SopessExaminationResultValueDto.OK;
      case UNKNOWN -> SopessExaminationResultValueDto.UNKNOWN;
    };
  }

  private static HandednessValueDto mapToDto(HandednessValue handednessValue) {
    return switch (handednessValue) {
      case null -> null;
      case RIGHT -> HandednessValueDto.RIGHT;
      case LEFT -> HandednessValueDto.LEFT;
      case UNCERTAIN -> HandednessValueDto.UNCERTAIN;
      case UNKNOWN -> HandednessValueDto.UNKNOWN;
    };
  }

  private static PrimaryLanguageValueDto mapToDto(PrimaryLanguageValue primaryLanguage) {
    return switch (primaryLanguage) {
      case null -> null;
      case GERMAN -> PrimaryLanguageValueDto.GERMAN;
      case OTHER -> PrimaryLanguageValueDto.OTHER;
      case OTHER_AND_GERMAN -> PrimaryLanguageValueDto.OTHER_AND_GERMAN;
      case MULTIPLE_OTHER -> PrimaryLanguageValueDto.MULTIPLE_OTHER;
      case UNKNOWN -> PrimaryLanguageValueDto.UNKNOWN;
    };
  }

  private static LanguageKnowledgeValueDto mapToDto(
      LanguageKnowledgeValue germanKnowledgePrimaryCarer) {
    return switch (germanKnowledgePrimaryCarer) {
      case null -> null;
      case RUDIMENTARY -> LanguageKnowledgeValueDto.RUDIMENTARY;
      case FAULTY -> LanguageKnowledgeValueDto.FAULTY;
      case FAULTLESS -> LanguageKnowledgeValueDto.FAULTLESS;
      case UNKNOWN -> LanguageKnowledgeValueDto.UNKNOWN;
    };
  }

  private static FamilyLanguageValueDto mapToDto(FamilyLanguageValue familyLanguage) {
    return switch (familyLanguage) {
      case null -> null;
      case GERMAN -> FamilyLanguageValueDto.GERMAN;
      case TURKISH -> FamilyLanguageValueDto.TURKISH;
      case KURDISH -> FamilyLanguageValueDto.KURDISH;
      case RUSSIAN -> FamilyLanguageValueDto.RUSSIAN;
      case POLISH -> FamilyLanguageValueDto.POLISH;
      case ARABIC -> FamilyLanguageValueDto.ARABIC;
      case FARSI_DARI -> FamilyLanguageValueDto.FARSI_DARI;
      case SERBO_CROATIAN -> FamilyLanguageValueDto.SERBO_CROATIAN;
      case ROMAN -> FamilyLanguageValueDto.ROMAN;
      case BULGARIAN -> FamilyLanguageValueDto.BULGARIAN;
      case PASHTU -> FamilyLanguageValueDto.PASHTU;
      case TIGRINIA -> FamilyLanguageValueDto.TIGRINIA;
      case BERBERIAN -> FamilyLanguageValueDto.BERBERIAN;
      case AMHARIAN -> FamilyLanguageValueDto.AMHARIAN;
      case ARAMEAN -> FamilyLanguageValueDto.ARAMEAN;
      case ITALIAN -> FamilyLanguageValueDto.ITALIAN;
      case SPANISH -> FamilyLanguageValueDto.SPANISH;
      case GREEK -> FamilyLanguageValueDto.GREEK;
      case PORTUGUESE -> FamilyLanguageValueDto.PORTUGUESE;
      case ENGLISH -> FamilyLanguageValueDto.ENGLISH;
      case FRENCH -> FamilyLanguageValueDto.FRENCH;
      case URDU -> FamilyLanguageValueDto.URDU;
      case OTHER_EUROPEAN_LANGUAGES -> FamilyLanguageValueDto.OTHER_EUROPEAN_LANGUAGES;
      case OTHER_ASIAN_LANGUAGES -> FamilyLanguageValueDto.OTHER_ASIAN_LANGUAGES;
      case OTHER_AFRICAN_LANGUAGES -> FamilyLanguageValueDto.OTHER_AFRICAN_LANGUAGES;
      case OTHER_LANGUAGES -> FamilyLanguageValueDto.OTHER_LANGUAGES;
      case UNKNOWN -> FamilyLanguageValueDto.UNKNOWN;
    };
  }

  private static GermanKnowledgeValueDto mapToDto(GermanKnowledgeValue germanKnowledgeChild) {
    return switch (germanKnowledgeChild) {
      case null -> null;
      case NO_GERMAN -> GermanKnowledgeValueDto.NO_GERMAN;
      case BAD -> GermanKnowledgeValueDto.BAD;
      case FLUID_WITH_MAJOR_ERRORS -> GermanKnowledgeValueDto.FLUID_WITH_MAJOR_ERRORS;
      case FLUID_WITH_MINOR_ERRORS -> GermanKnowledgeValueDto.FLUID_WITH_MINOR_ERRORS;
      case FAULTLESS -> GermanKnowledgeValueDto.FAULTLESS;
      case UNKNOWN -> GermanKnowledgeValueDto.UNKNOWN;
    };
  }

  private static ArticulationValueDto mapToDto(ArticulationValue articulationValue) {
    return switch (articulationValue) {
      case null -> null;
      case INCONSPICUOUS -> ArticulationValueDto.INCONSPICUOUS;
      case CONSPICUOUS -> ArticulationValueDto.CONSPICUOUS;
      case UNKNOWN -> ArticulationValueDto.UNKNOWN;
    };
  }

  public static DevelopmentScreening mapToDomain(DevelopmentScreeningResultDto dto) {
    if (dto == null) {
      return null;
    }
    DevelopmentScreening result = new DevelopmentScreening();
    MeasurementsDto measurements = dto.measurements();
    result.setHeight(measurements.height());
    result.setWeight(measurements.weight());
    result.setSystole(measurements.systole());
    result.setDiastole(measurements.diastole());

    PhysicalExaminationDto physicalExamination = dto.physicalExamination();
    result.setNutritionalCondition(mapToDomain(physicalExamination.getNutritionalCondition()));
    result.setNeurology(mapToDomain(physicalExamination.getNeurology()));
    result.setRespiratoryCardiovascular(
        mapToDomain(physicalExamination.getRespiratoryCardiovascular()));
    result.setSkin(mapToDomain(physicalExamination.getSkin()));
    result.setMusculatureSkeleton(mapToDomain(physicalExamination.getMusculatureSkeleton()));
    result.setMetabolism(mapToDomain(physicalExamination.getMetabolism()));
    result.setAbdomen(mapToDomain(physicalExamination.getAbdomen()));
    result.setEarNoseThroat(mapToDomain(physicalExamination.getEarNoseThroat()));
    result.setPhysicalExaminationNote(physicalExamination.getNote());

    HandicapDto handicap = dto.handicap();
    result.setChronicDisease(mapToDomain(handicap.chronicDisease()));
    result.setDisability(mapToDomain(handicap.disability()));
    result.setDisabilityType(mapToDomain(handicap.disabilityType()));
    result.setHandicapNote(handicap.note());

    PsychoSocialRiskDto psychoSocialRisk = dto.psychoSocialRisk();
    result.setFamily(psychoSocialRisk.family());
    result.setNonCompliance(psychoSocialRisk.nonCompliance());
    result.setSocial(psychoSocialRisk.social());
    result.setMigration(psychoSocialRisk.migration());
    result.setOtherRisk(psychoSocialRisk.otherRisk());

    SocioEducationalPerformanceDto socioEducationalPerformance = dto.socioEducationalPerformance();
    result.setReIntroduction(socioEducationalPerformance.reIntroduction());
    result.setSchoolCounselling(socioEducationalPerformance.schoolCounselling());
    result.setMotorPromotion(socioEducationalPerformance.motorPromotion());
    result.setEducationalAdvice(socioEducationalPerformance.educationalAdvice());
    result.setLanguageAdvice(socioEducationalPerformance.languageAdvice());
    result.setNutritionalAdvice(socioEducationalPerformance.nutritionalAdvice());
    result.setVaccinationAdvice(socioEducationalPerformance.vaccinationAdvice());
    result.setSocialService(socioEducationalPerformance.socialService());
    result.setOtherSupport(socioEducationalPerformance.otherSupport());
    result.setInfoLetter(socioEducationalPerformance.infoLetter());

    result.setExtraEffort(dto.extraEffort());
    result.setSchoolRecommendation(mapToDomain(dto.schoolRecommendation()));
    result.setSchoolFeedback(mapToDomain(dto.schoolFeedback()));

    return result;
  }

  private static ExaminationWithDiagnosis mapToDomain(
      ExaminationWithDiagnosisDto examinationWithDiagnosisDto) {
    if (examinationWithDiagnosisDto == null) {
      return null;
    }
    ExaminationWithDiagnosis examinationWithDiagnosis = new ExaminationWithDiagnosis();
    examinationWithDiagnosis.setResult(
        mapToDomain(examinationWithDiagnosisDto.examinationResult()));
    examinationWithDiagnosis.setIcd10Codes(
        mapIcd10CodesToDomain(examinationWithDiagnosisDto.icd10Codes()));
    return examinationWithDiagnosis;
  }

  private static List<String> mapIcd10CodesToDomain(
      List<Icd10CodeWithOriginalCodeDto> icd10CodeWithOriginalCodeList) {
    if (icd10CodeWithOriginalCodeList == null) {
      return Collections.emptyList();
    }
    return icd10CodeWithOriginalCodeList.stream().map(Icd10CodeWithOriginalCodeDto::code).toList();
  }

  private static HandicapWithDiagnosis mapToDomain(HandicapWithDiagnosisDto dto) {
    if (dto == null) {
      return null;
    }
    HandicapWithDiagnosis handicapWithDiagnosis = new HandicapWithDiagnosis();
    handicapWithDiagnosis.setResult(dto.result());
    handicapWithDiagnosis.setIcd10Codes(mapIcd10CodesToDomain(dto.icd10Codes()));
    return handicapWithDiagnosis;
  }

  private static DisabilityType mapToDomain(DisabilityTypeDto dto) {
    return switch (dto) {
      case null -> null;
      case PHYSICAL -> DisabilityType.PHYSICAL;
      case MENTAL -> DisabilityType.MENTAL;
      case EMOTIONAL -> DisabilityType.EMOTIONAL;
      case MULTIPLE -> DisabilityType.MULTIPLE;
    };
  }

  private static SchoolRecommendation mapToDomain(SchoolRecommendationDto dto) {
    return switch (dto) {
      case null -> null;
      case BACK_REGULAR -> SchoolRecommendation.BACK_REGULAR;
      case BACK_ENTRY_LEVEL -> SchoolRecommendation.BACK_ENTRY_LEVEL;
      case CONCERNS_EARLY_ENROLMENT -> SchoolRecommendation.CONCERNS_EARLY_ENROLMENT;
      case ADVICE_CENTER -> SchoolRecommendation.ADVICE_CENTER;
      case NO -> SchoolRecommendation.NO;
    };
  }

  private static SchoolFeedback mapToDomain(SchoolFeedbackDto dto) {
    return switch (dto) {
      case null -> null;
      case POSITIVE -> SchoolFeedback.POSITIVE;
      case NEGATIVE -> SchoolFeedback.NEGATIVE;
      case UNKNOWN -> SchoolFeedback.UNKNOWN;
    };
  }

  private static List<Icd10CodeWithOriginalCodeDto> mapIcd10CodeListToDto(
      List<String> codes, Map<String, String> icd10CodeToOriginalCode) {
    if (codes == null || codes.isEmpty()) {
      return List.of();
    }
    return codes.stream()
        .map(
            code ->
                new Icd10CodeWithOriginalCodeDto(
                    code, icd10CodeToOriginalCode.getOrDefault(code, code)))
        .collect(Collectors.toList());
  }

  public static GetDevelopmentScreeningResultDto mapToDto(
      DevelopmentScreening examinationResult, Map<String, String> icd10CodeToOriginalCode) {
    if (examinationResult == null) {
      return null;
    }
    return new GetDevelopmentScreeningResultDto(
        examinationResult.getVersion(),
        new MeasurementsDto(
            examinationResult.getHeight(),
            examinationResult.getWeight(),
            examinationResult.getSystole(),
            examinationResult.getDiastole()),
        new PercentilesDto(
            examinationResult.getHeightPercentile(),
            examinationResult.getWeightPercentile(),
            examinationResult.getBmi(),
            examinationResult.getBmiPercentile()),
        new PhysicalExaminationDto(
            mapToDto(examinationResult.getNutritionalCondition(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getNeurology(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getRespiratoryCardiovascular(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getSkin(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getMusculatureSkeleton(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getMetabolism(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getAbdomen(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getEarNoseThroat(), icd10CodeToOriginalCode),
            examinationResult.getPhysicalExaminationNote()),
        new HandicapDto(
            mapToDto(examinationResult.getChronicDisease(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getDisability(), icd10CodeToOriginalCode),
            mapToDto(examinationResult.getDisabilityType()),
            examinationResult.getHandicapNote()),
        new PsychoSocialRiskDto(
            examinationResult.getFamily(),
            examinationResult.getNonCompliance(),
            examinationResult.getSocial(),
            examinationResult.getMigration(),
            examinationResult.getOtherRisk()),
        new SocioEducationalPerformanceDto(
            examinationResult.getReIntroduction(),
            examinationResult.getSchoolCounselling(),
            examinationResult.getMotorPromotion(),
            examinationResult.getEducationalAdvice(),
            examinationResult.getLanguageAdvice(),
            examinationResult.getNutritionalAdvice(),
            examinationResult.getVaccinationAdvice(),
            examinationResult.getSocialService(),
            examinationResult.getOtherSupport(),
            examinationResult.getInfoLetter()),
        examinationResult.getExtraEffort(),
        mapToDto(examinationResult.getSchoolRecommendation()),
        mapToDto(examinationResult.getSchoolFeedback()));
  }

  private static ExaminationWithDiagnosisDto mapToDto(
      ExaminationWithDiagnosis examinationWithDiagnosis,
      Map<String, String> icd10CodeToOriginalCode) {
    if (examinationWithDiagnosis == null) {
      return null;
    }
    return new ExaminationWithDiagnosisDto(
        mapToDto(examinationWithDiagnosis.getResult()),
        mapIcd10CodeListToDto(examinationWithDiagnosis.getIcd10Codes(), icd10CodeToOriginalCode));
  }

  private static HandicapWithDiagnosisDto mapToDto(
      HandicapWithDiagnosis handicapWithDiagnosis, Map<String, String> icd10CodeToOriginalCode) {
    if (handicapWithDiagnosis == null) {
      return null;
    }
    return new HandicapWithDiagnosisDto(
        handicapWithDiagnosis.getResult(),
        mapIcd10CodeListToDto(handicapWithDiagnosis.getIcd10Codes(), icd10CodeToOriginalCode));
  }

  private static DisabilityTypeDto mapToDto(DisabilityType disabilityType) {
    return switch (disabilityType) {
      case null -> null;
      case PHYSICAL -> DisabilityTypeDto.PHYSICAL;
      case MENTAL -> DisabilityTypeDto.MENTAL;
      case EMOTIONAL -> DisabilityTypeDto.EMOTIONAL;
      case MULTIPLE -> DisabilityTypeDto.MULTIPLE;
    };
  }

  private static SchoolRecommendationDto mapToDto(SchoolRecommendation schoolRecommendation) {
    return switch (schoolRecommendation) {
      case null -> null;
      case BACK_REGULAR -> SchoolRecommendationDto.BACK_REGULAR;
      case BACK_ENTRY_LEVEL -> SchoolRecommendationDto.BACK_ENTRY_LEVEL;
      case CONCERNS_EARLY_ENROLMENT -> SchoolRecommendationDto.CONCERNS_EARLY_ENROLMENT;
      case ADVICE_CENTER -> SchoolRecommendationDto.ADVICE_CENTER;
      case NO -> SchoolRecommendationDto.NO;
    };
  }

  private static SchoolFeedbackDto mapToDto(SchoolFeedback schoolFeedback) {
    return switch (schoolFeedback) {
      case null -> null;
      case POSITIVE -> SchoolFeedbackDto.POSITIVE;
      case NEGATIVE -> SchoolFeedbackDto.NEGATIVE;
      case UNKNOWN -> SchoolFeedbackDto.UNKNOWN;
    };
  }
}
