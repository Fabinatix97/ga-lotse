/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter;

import static de.eshg.schoolentry.domain.model.SchoolRecommendation.BACK_ENTRY_LEVEL;
import static de.eshg.schoolentry.domain.model.SchoolRecommendation.BACK_REGULAR;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.CreateSchoolInfoLetterRequest;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterExamination;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterExaminationType;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterEyeExaminationInfo;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterHearingExaminationInfo;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterMeaslesContraIndicationDuration;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterParentsWish;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterPhysiciansRecommendation;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterSchoolAndPromotionHints;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterTherapyAndPromotionInfo;
import de.eshg.schoolentry.domain.model.schoolinfoletter.SchoolInfoLetterVaccinationInfo;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.*;
import de.eshg.schoolentry.statistics.SopessStatistics;
import de.eshg.schoolentry.statistics.options.EvaluationResult;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

@Component
public class SchoolInfoLetterExaminationMapper {

  public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  private static final DateTimeFormatter YEAR_FORMATTER = DateTimeFormatter.ofPattern("yyyy");
  private final Clock clock;

  public SchoolInfoLetterExaminationMapper(Clock clock) {
    this.clock = clock;
  }

  public SchoolInfoLetterExaminationDto mapToData(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetailsData,
      CreateSchoolInfoLetterRequest request) {
    DevelopmentScreening developmentScreening = procedure.getDevelopmentScreeningResult();
    SopessExaminationResult sopess = procedure.getSopessExaminationResult();
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    boolean prefilled = request.prefilled();
    LocalDate examinationDate = getExaminationDate(procedure, procedureDetailsData);

    return new SchoolInfoLetterExaminationDto(
        createSchoolInfoLetterChild(procedureDetailsData),
        getFormattedSchoolYear(procedureDetailsData),
        DATE_FORMATTER.format(examinationDate),
        prefilled ? determineSchoolInfoLetterExaminationType(procedureDetailsData.type()) : null,
        prefilled
            && List.of(BACK_REGULAR, BACK_ENTRY_LEVEL)
                .contains(developmentScreening.getSchoolRecommendation()),
        prefilled ? determineSopessExaminationResult(sopess) : null,
        request.note(),
        request.customRecommendation(),
        prefilled ? determineVaccinationResult(vaccinationStatus) : null,
        prefilled
            ? determineEyeExaminationResult(
                eyeExaminationResult, procedure.getAnamnesis().getSpectaclesSince() != null)
            : null,
        prefilled ? determineHearingExaminationResult(procedure.getHearingTestResult()) : null,
        request.consultationWithCustodianRecommended(),
        prefilled
            ? determineTherapyAndPromotionInfo(procedure.getAnamnesis(), examinationDate)
            : null,
        determinePhysiciansRecommendation(procedure.getDevelopmentScreeningResult(), request),
        new SchoolInfoLetterParentsWishDto(
            request.parentsWishNote(), request.referredToFurtherConsultationFromSchool()));
  }

  public SchoolInfoLetterExaminationDto determineDefaultSchoolInfoLetterExamination(
      SchoolEntryProcedure procedure, ProcedureDetailsData procedureDetailsData) {
    DevelopmentScreening developmentScreening = procedure.getDevelopmentScreeningResult();
    SopessExaminationResult sopess = procedure.getSopessExaminationResult();
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    LocalDate examinationDate = getExaminationDate(procedure, procedureDetailsData);

    return new SchoolInfoLetterExaminationDto(
        createSchoolInfoLetterChild(procedureDetailsData),
        getFormattedSchoolYear(procedureDetailsData),
        DATE_FORMATTER.format(examinationDate),
        determineSchoolInfoLetterExaminationType(procedureDetailsData.type()),
        List.of(BACK_REGULAR, BACK_ENTRY_LEVEL)
            .contains(developmentScreening.getSchoolRecommendation()),
        determineSopessExaminationResult(sopess),
        null,
        null,
        determineVaccinationResult(vaccinationStatus),
        determineEyeExaminationResult(
            eyeExaminationResult, procedure.getAnamnesis().getSpectaclesSince() != null),
        determineHearingExaminationResult(procedure.getHearingTestResult()),
        false,
        determineTherapyAndPromotionInfo(procedure.getAnamnesis(), examinationDate),
        determinePhysiciansRecommendation(procedure.getDevelopmentScreeningResult()),
        new SchoolInfoLetterParentsWishDto(null, false));
  }

  private static SchoolInfoLetterChild createSchoolInfoLetterChild(
      ProcedureDetailsData procedureDetails) {
    return new SchoolInfoLetterChild(
        String.join(" ", procedureDetails.child().firstName(), procedureDetails.child().lastName()),
        procedureDetails.child().dateOfBirth().format(DATE_FORMATTER));
  }

  private LocalDate getExaminationDate(
      SchoolEntryProcedure procedure, ProcedureDetailsData procedureDetails) {
    return procedure.getExaminationDate() != null
        ? procedure.getExaminationDate()
        : procedureDetails.appointment().getAppointmentEnd().atZone(clock.getZone()).toLocalDate();
  }

  private static String getFormattedSchoolYear(ProcedureDetailsData procedureDetails) {
    return YEAR_FORMATTER.format(procedureDetails.schoolYear());
  }

  private static SchoolInfoLetterExaminationTypeDto determineSchoolInfoLetterExaminationType(
      ProcedureType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> SchoolInfoLetterExaminationTypeDto.REGULAR_EXAMINATION;
      case CAN_CHILD -> SchoolInfoLetterExaminationTypeDto.CAN_CHILD;
      case ENTRY_LEVEL -> SchoolInfoLetterExaminationTypeDto.ENTRY_LEVEL;
      default -> throw new IllegalStateException("Unexpected value: " + type);
    };
  }

  private static SchoolInfoLetterSchoolAndPromotionHintsDto determineSopessExaminationResult(
      SopessExaminationResult sopess) {
    return new SchoolInfoLetterSchoolAndPromotionHintsDto(
        determineConspicuousness(sopess.getPsychologicalBehaviorResult()),
        determineConspicuousness(sopess.getSpeechResult()),
        determineArticulationPointSum(sopess),
        determinePrepositionPointsConspicuous(sopess.getPrepositionPoints())
            || determinePluralPointsConspicuous(sopess.getPluralPoints()),
        determineConspicuousness(sopess.getAuditiveProcessingResult()),
        determineConspicuousness(sopess.getVisualPerceptionResult()),
        determineConspicuousness(sopess.getKnowledgeThinkingResult()),
        determineConspicuousness(sopess.getFineMotorSkills()),
        determineConspicuousness(sopess.getGrossMotorSkills()),
        sopess.getHandednessValue() == HandednessValue.LEFT);
  }

  private static boolean determineConspicuousness(SopessExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER -> true;
      case BORDERLINE, OK, UNKNOWN -> false;
    };
  }

  private static Boolean determineArticulationPointSum(SopessExaminationResult examinationResult) {
    return SopessStatistics.articulationPointSum(examinationResult.getAllArticulationsValues())
        .map(sum -> sum > 0)
        .orElse(false);
  }

  private static boolean determinePrepositionPointsConspicuous(int prepositionPoints) {
    return determineConspicuousness(SopessStatistics.prepositionsAssessment(prepositionPoints));
  }

  private static boolean determineConspicuousness(EvaluationResult evaluationResult) {
    return switch (evaluationResult) {
      case CONSPICUOUS -> true;
      case BORDERLINE, INCONSPICUOUS, UNKNOWN -> false;
    };
  }

  private static boolean determinePluralPointsConspicuous(int pluralPoints) {
    return determineConspicuousness(SopessStatistics.pluralsAssessment(pluralPoints));
  }

  private static SchoolInfoLetterVaccinationInfoDto determineVaccinationResult(
      VaccinationStatus vaccinationStatus) {
    boolean measlesProtectionComplete = vaccinationStatus.getMmr() >= 2;
    return new SchoolInfoLetterVaccinationInfoDto(
        measlesProtectionComplete,
        Optional.ofNullable(vaccinationStatus.getVaccinationPassPresented())
            .map(presented -> !presented)
            .orElse(false),
        Boolean.TRUE.equals(vaccinationStatus.getMeaslesContraIndication()),
        determineContraIndicationDuration(vaccinationStatus),
        vaccinationStatus.getMeaslesContraIndicationUntil() != null
            ? vaccinationStatus.getMeaslesContraIndicationUntil()
            : null);
  }

  private static SchoolInfoLetterMeaslesContraIndicationDurationDto
      determineContraIndicationDuration(VaccinationStatus vaccinationStatus) {
    if (Boolean.TRUE.equals(vaccinationStatus.getMeaslesContraIndicationIsPermanent())) {
      return SchoolInfoLetterMeaslesContraIndicationDurationDto.PERMANENT;
    } else if (Boolean.TRUE.equals(vaccinationStatus.getMeaslesContraIndication())) {
      return SchoolInfoLetterMeaslesContraIndicationDurationDto.TEMPORARY;
    }
    return null;
  }

  private static SchoolInfoLetterEyeExaminationInfoDto determineEyeExaminationResult(
      EyeExaminationResult eyeExaminationResult, boolean isSpectacleWearer) {
    boolean conspicuous =
        examinationResultsNotAllOk(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination()));
    boolean colorSenseDisorder =
        examinationResultValueIsKnownOrDoctorLetter(
            eyeExaminationResult.getIshiharaExamination().getValue());
    return new SchoolInfoLetterEyeExaminationInfoDto(
        conspicuous,
        determineClarificationArranged(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination())),
        isSpectacleWearer,
        determineUnderTreatment(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination())),
        colorSenseDisorder);
  }

  private static boolean examinationResultsNotAllOk(Stream<ExaminationResult> results) {
    return examinationResultValues(results)
        .anyMatch(SchoolInfoLetterExaminationMapper::examinationResultValueIsKnownOrDoctorLetter);
  }

  private static Stream<ExaminationResultValue> examinationResultValues(
      Stream<ExaminationResult> results) {
    return results
        .filter(Objects::nonNull)
        .map(ExaminationResult::getValue)
        .filter(Objects::nonNull);
  }

  private static boolean examinationResultValueIsKnownOrDoctorLetter(ExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER -> true;
      case null, default -> false;
    };
  }

  private static SchoolInfoLetterHearingExaminationInfoDto determineHearingExaminationResult(
      HearingTestResult hearingTestResult) {
    boolean conspicuous =
        examinationResultsNotAllOk(Stream.of(hearingTestResult.getExaminationResult()));
    return new SchoolInfoLetterHearingExaminationInfoDto(
        conspicuous,
        determineClarificationArranged(Stream.of(hearingTestResult.getExaminationResult())),
        determineUnderTreatment(Stream.of(hearingTestResult.getExaminationResult())));
  }

  private static SchoolInfoLetterTherapyAndPromotionInfoDto determineTherapyAndPromotionInfo(
      Anamnesis anamnesis, LocalDate examinationDate) {
    return new SchoolInfoLetterTherapyAndPromotionInfoDto(
        anamnesis.getSpeechTherapy()
            && endDateNotPresentOrNotBeforeExamination(
                anamnesis.getSpeechTherapyEnd(), examinationDate),
        anamnesis.getErgotherapy()
            && endDateNotPresentOrNotBeforeExamination(
                anamnesis.getErgoTherapyEnd(), examinationDate),
        anamnesis.getPhysiotherapy()
            && endDateNotPresentOrNotBeforeExamination(
                anamnesis.getPhysioTherapyEnd(), examinationDate),
        // currently hardcoded value (info source was not found)
        false,
        Optional.ofNullable(anamnesis.getAdditionalTherapies())
            .map(additionalTherapies -> !additionalTherapies.isEmpty())
            .orElse(false));
  }

  private static boolean endDateNotPresentOrNotBeforeExamination(
      LocalDate therapyEnd, LocalDate examinationDate) {
    return therapyEnd == null || !therapyEnd.isBefore(examinationDate);
  }

  private static SchoolInfoLetterPhysiciansRecommendationDto determinePhysiciansRecommendation(
      DevelopmentScreening result, CreateSchoolInfoLetterRequest request) {
    SchoolRecommendation schoolRecommendation = result.getSchoolRecommendation();
    boolean prefilled = request == null || request.prefilled();
    return new SchoolInfoLetterPhysiciansRecommendationDto(
        prefilled
            && (schoolRecommendation.equals(SchoolRecommendation.CONCERNS_EARLY_ENROLMENT)
                || schoolRecommendation.equals(SchoolRecommendation.BACK_REGULAR)),
        prefilled && result.getSchoolCounselling(),
        prefilled && schoolRecommendation.equals(SchoolRecommendation.ADVICE_CENTER),
        prefilled && schoolRecommendation.equals(SchoolRecommendation.BACK_REGULAR),
        prefilled && result.getOtherSupport(),
        request != null
            && request.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended());
  }

  private static boolean determineClarificationArranged(
      Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(
            value ->
                value.equals(ExaminationResultValue.DOCTOR_LETTER)
                    || value.equals(ExaminationResultValue.UNKNOWN));
  }

  private static boolean determineUnderTreatment(Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(value -> value.equals(ExaminationResultValue.KNOWN));
  }

  private static SchoolInfoLetterPhysiciansRecommendationDto determinePhysiciansRecommendation(
      DevelopmentScreening result) {
    SchoolRecommendation schoolRecommendation = result.getSchoolRecommendation();
    return new SchoolInfoLetterPhysiciansRecommendationDto(
        schoolRecommendation.equals(SchoolRecommendation.CONCERNS_EARLY_ENROLMENT)
            || schoolRecommendation.equals(SchoolRecommendation.BACK_REGULAR),
        result.getSchoolCounselling(),
        schoolRecommendation.equals(SchoolRecommendation.ADVICE_CENTER),
        schoolRecommendation.equals(SchoolRecommendation.BACK_REGULAR),
        result.getOtherSupport(),
        false);
  }

  public SchoolInfoLetterExaminationDto mapToData(
      SchoolEntryProcedure procedure, ProcedureDetailsData procedureDetailsData) {
    SchoolInfoLetterExamination schoolInfoLetterExamination = procedure.getSchoolInfoLetter();
    LocalDate examinationDate = getExaminationDate(procedure, procedureDetailsData);
    if (schoolInfoLetterExamination == null) {
      return null;
    } else {
      return new SchoolInfoLetterExaminationDto(
          createSchoolInfoLetterChild(procedureDetailsData),
          getFormattedSchoolYear(procedureDetailsData),
          DATE_FORMATTER.format(examinationDate),
          mapToData(schoolInfoLetterExamination.getExaminationType()),
          schoolInfoLetterExamination.isPostponed(),
          mapToData(schoolInfoLetterExamination.getSchoolAndPromotionHints()),
          schoolInfoLetterExamination.getNote(),
          schoolInfoLetterExamination.getCustomRecommendation(),
          mapToData(schoolInfoLetterExamination.getVaccinationInfo()),
          mapToData(schoolInfoLetterExamination.getEyeExaminationInfo()),
          mapToData(schoolInfoLetterExamination.getHearingExaminationInfo()),
          schoolInfoLetterExamination.isConsultationWithCustodianRecommended(),
          mapToData(schoolInfoLetterExamination.getTherapyAndPromotionInfo()),
          mapToData(schoolInfoLetterExamination.getPhysiciansRecommendation()),
          mapToData(schoolInfoLetterExamination.getParentsWish()));
    }
  }

  private static SchoolInfoLetterExaminationTypeDto mapToData(
      SchoolInfoLetterExaminationType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> SchoolInfoLetterExaminationTypeDto.REGULAR_EXAMINATION;
      case CAN_CHILD -> SchoolInfoLetterExaminationTypeDto.CAN_CHILD;
      case ENTRY_LEVEL -> SchoolInfoLetterExaminationTypeDto.ENTRY_LEVEL;
    };
  }

  private static SchoolInfoLetterSchoolAndPromotionHintsDto mapToData(
      SchoolInfoLetterSchoolAndPromotionHints schoolAndPromotionHints) {
    return new SchoolInfoLetterSchoolAndPromotionHintsDto(
        schoolAndPromotionHints.isBehavior(),
        schoolAndPromotionHints.isLanguage(),
        schoolAndPromotionHints.isArticulation(),
        schoolAndPromotionHints.isGrammarAndVocabulary(),
        schoolAndPromotionHints.isAuditiveInformationProcessing(),
        schoolAndPromotionHints.isVisualPerception(),
        schoolAndPromotionHints.isColorsShapesNumbersSets(),
        schoolAndPromotionHints.isFineOrVisuoMotorSkills(),
        schoolAndPromotionHints.isGrossMotorSkillsOrPhysicalCoordination(),
        schoolAndPromotionHints.isLeftHandedness());
  }

  private static SchoolInfoLetterVaccinationInfoDto mapToData(
      SchoolInfoLetterVaccinationInfo vaccinationInfo) {
    return new SchoolInfoLetterVaccinationInfoDto(
        vaccinationInfo.isMeaslesProtectionComplete(),
        vaccinationInfo.isVaccinationPassNotPresented(),
        vaccinationInfo.isMeaslesContraIndication(),
        mapToData(vaccinationInfo.getMeaslesContraIndicationDuration()),
        vaccinationInfo.getMeaslesContraIndicationUntil());
  }

  private static SchoolInfoLetterMeaslesContraIndicationDurationDto mapToData(
      SchoolInfoLetterMeaslesContraIndicationDuration measlesContraIndication) {
    return switch (measlesContraIndication) {
      case PERMANENT -> SchoolInfoLetterMeaslesContraIndicationDurationDto.PERMANENT;
      case TEMPORARY -> SchoolInfoLetterMeaslesContraIndicationDurationDto.TEMPORARY;
      case null -> null;
    };
  }

  private static SchoolInfoLetterEyeExaminationInfoDto mapToData(
      SchoolInfoLetterEyeExaminationInfo eyeExaminationInfo) {
    return new SchoolInfoLetterEyeExaminationInfoDto(
        eyeExaminationInfo.isConspicuous(),
        eyeExaminationInfo.isClarificationArranged(),
        eyeExaminationInfo.isSpectacleWearer(),
        eyeExaminationInfo.isUnderTreatment(),
        eyeExaminationInfo.isColorSenseDisorder());
  }

  private static SchoolInfoLetterHearingExaminationInfoDto mapToData(
      SchoolInfoLetterHearingExaminationInfo hearingExaminationInfo) {
    return new SchoolInfoLetterHearingExaminationInfoDto(
        hearingExaminationInfo.isConspicuous(),
        hearingExaminationInfo.isClarificationArranged(),
        hearingExaminationInfo.isUnderTreatment());
  }

  private static SchoolInfoLetterTherapyAndPromotionInfoDto mapToData(
      SchoolInfoLetterTherapyAndPromotionInfo therapyAndPromotionInfo) {
    return new SchoolInfoLetterTherapyAndPromotionInfoDto(
        therapyAndPromotionInfo.isSpeechTherapy(),
        therapyAndPromotionInfo.isErgoTherapy(),
        therapyAndPromotionInfo.isPhysioTherapy(),
        therapyAndPromotionInfo.isPsychoMotorSkills(),
        therapyAndPromotionInfo.isMiscellaneous());
  }

  private static SchoolInfoLetterPhysiciansRecommendationDto mapToData(
      SchoolInfoLetterPhysiciansRecommendation physiciansRecommendation) {
    return new SchoolInfoLetterPhysiciansRecommendationDto(
        physiciansRecommendation.isConcernsCanChild(),
        physiciansRecommendation.isSpecialPromotion(),
        physiciansRecommendation.isIntroductionInBFZ(),
        physiciansRecommendation.isPromotionOutsideSchool(),
        physiciansRecommendation.isFurtherMeasures(),
        physiciansRecommendation
            .isMeetingBetweenYouthHealthServicesAndSchoolManagementRecommended());
  }

  private static SchoolInfoLetterParentsWishDto mapToData(SchoolInfoLetterParentsWish parentsWish) {
    return new SchoolInfoLetterParentsWishDto(
        parentsWish.getNote(), parentsWish.isReferredToFurtherConsultationFromSchool());
  }
}
