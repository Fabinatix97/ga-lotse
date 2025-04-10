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
import de.eshg.schoolentry.pdf.schoolinfoletter.model.*;
import de.eshg.schoolentry.pdf.schoolinfoletter.model.SchoolInfoLetterExaminationType.Type;
import de.eshg.schoolentry.statistics.SopessStatistics;
import de.eshg.schoolentry.statistics.options.EvaluationResult;
import java.time.Clock;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

@Component
public class SchoolInfoLetterExaminationMapper {

  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
  private static final DateTimeFormatter YEAR_FORMATTER = DateTimeFormatter.ofPattern("yyyy");
  private final Clock clock;

  public SchoolInfoLetterExaminationMapper(Clock clock) {
    this.clock = clock;
  }

  public SchoolInfoLetterExamination mapToData(
      SchoolEntryProcedure procedure,
      ProcedureDetailsData procedureDetailsData,
      CreateSchoolInfoLetterRequest request) {
    DevelopmentScreening developmentScreening = procedure.getDevelopmentScreeningResult();
    SopessExaminationResult sopess = procedure.getSopessExaminationResult();
    VaccinationStatus vaccinationStatus = procedure.getVaccinationStatus();
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    boolean prefilled = request.prefilled();

    return new SchoolInfoLetterExamination(
        createSchoolInfoLetterChild(procedureDetailsData),
        getFormattedSchoolYear(procedureDetailsData),
        getFormattedExaminationDate(procedure, procedureDetailsData),
        prefilled
            ? new SchoolInfoLetterExaminationType(
                mapType(procedureDetailsData.type()),
                List.of(BACK_REGULAR, BACK_ENTRY_LEVEL)
                    .contains(developmentScreening.getSchoolRecommendation()))
            : null,
        prefilled ? mapSopessExaminationResult(sopess) : null,
        request.note(),
        prefilled ? mapVaccinationResult(vaccinationStatus) : null,
        prefilled
            ? mapEyeExaminationResult(
                eyeExaminationResult, procedure.getAnamnesis().getSpectaclesSince() != null)
            : null,
        prefilled ? mapHearingExaminationResult(procedure.getHearingTestResult()) : null,
        request.consultationWithCustodianRecommended(),
        prefilled ? mapTherapyAndPromotionInfo(procedure.getAnamnesis()) : null,
        mapPhysiciansRecommendation(procedure.getDevelopmentScreeningResult(), request),
        new SchoolInfoLetterParentsWish(
            request.parentsWishNote(), request.referredToFurtherConsultationFromSchool()));
  }

  private String getFormattedSchoolYear(ProcedureDetailsData procedureDetails) {
    return YEAR_FORMATTER.format(procedureDetails.schoolYear());
  }

  private String getFormattedExaminationDate(
      SchoolEntryProcedure procedure, ProcedureDetailsData procedureDetails) {
    return DATE_FORMATTER.format(
        procedure.getExaminationDate() != null
            ? procedure.getExaminationDate()
            : procedureDetails.appointment().getAppointmentEnd().atZone(clock.getZone()));
  }

  private SchoolInfoLetterChild createSchoolInfoLetterChild(ProcedureDetailsData procedureDetails) {
    return new SchoolInfoLetterChild(
        concat(procedureDetails.child().firstName(), procedureDetails.child().lastName()),
        procedureDetails.child().dateOfBirth().format(DATE_FORMATTER));
  }

  private static String concat(String... parts) {
    return String.join(" ", parts);
  }

  private static Type mapType(ProcedureType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> Type.REGULAR_EXAMINATION;
      case CAN_CHILD -> Type.CAN_CHILD;
      case ENTRY_LEVEL -> Type.ENTRY_LEVEL;
      default ->
          throw new IllegalArgumentException("Unexpected value for school info letter: " + type);
    };
  }

  private static SchoolInfoLetterSchoolAndPromotionHints mapSopessExaminationResult(
      SopessExaminationResult sopess) {
    return new SchoolInfoLetterSchoolAndPromotionHints(
        mapSopessExaminationResultValue(sopess.getPsychologicalBehaviorResult()),
        mapSopessExaminationResultValue(sopess.getSpeechResult()),
        articulationPointSum(sopess),
        prepositionPointsConspicuous(sopess.getPrepositionPoints())
            || pluralPointsConspicuous(sopess.getPluralPoints()),
        mapSopessExaminationResultValue(sopess.getAuditiveProcessingResult()),
        mapSopessExaminationResultValue(sopess.getVisualPerceptionResult()),
        mapSopessExaminationResultValue(sopess.getKnowledgeThinkingResult()),
        mapSopessExaminationResultValue(sopess.getFineMotorSkills()),
        mapSopessExaminationResultValue(sopess.getGrossMotorSkills()),
        sopess.getHandednessValue() == HandednessValue.LEFT);
  }

  private static Boolean articulationPointSum(SopessExaminationResult examinationResult) {
    return SopessStatistics.articulationPointSum(examinationResult.getAllArticulationsValues())
        .map(sum -> sum > 0)
        .orElse(false);
  }

  private static boolean mapSopessExaminationResultValue(SopessExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER, BORDERLINE -> true;
      default -> false;
    };
  }

  private static boolean prepositionPointsConspicuous(int prepositionPoints) {
    return mapEvaluationResult(SopessStatistics.prepositionsAssessment(prepositionPoints));
  }

  private static boolean pluralPointsConspicuous(int pluralPoints) {
    return mapEvaluationResult(SopessStatistics.pluralsAssessment(pluralPoints));
  }

  private static boolean mapEvaluationResult(EvaluationResult evaluationResult) {
    return switch (evaluationResult) {
      case CONSPICUOUS, BORDERLINE -> true;
      case INCONSPICUOUS, UNKNOWN -> false;
    };
  }

  private static SchoolInfoLetterVaccinationInfo mapVaccinationResult(
      VaccinationStatus vaccinationStatus) {
    boolean measlesProtectionComplete = vaccinationStatus.getMmr() >= 2;
    return new SchoolInfoLetterVaccinationInfo(
        measlesProtectionComplete,
        Optional.ofNullable(vaccinationStatus.getVaccinationPassPresented())
            .map(presented -> !presented)
            .orElse(false),
        Optional.ofNullable(vaccinationStatus.getMeaslesContraIndication()).orElse(false),
        Optional.ofNullable(vaccinationStatus.getMeaslesContraIndicationIsPermanent())
            .orElse(false),
        vaccinationStatus.getMeaslesContraIndicationUntil() != null
            ? vaccinationStatus.getMeaslesContraIndicationUntil().format(DATE_FORMATTER)
            : null);
  }

  private static SchoolInfoLetterEyeExaminationInfo mapEyeExaminationResult(
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
    return new SchoolInfoLetterEyeExaminationInfo(
        conspicuous,
        mapClarificationArranged(
            Stream.of(
                eyeExaminationResult.getEyeExamination(),
                eyeExaminationResult.getLangExamination(),
                eyeExaminationResult.getIshiharaExamination())),
        isSpectacleWearer,
        mapUnderTreatment(
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

  private static boolean examinationResultValueIsKnownOrDoctorLetter(ExaminationResultValue value) {
    return switch (value) {
      case KNOWN, DOCTOR_LETTER -> true;
      case null, default -> false;
    };
  }

  private static SchoolInfoLetterHearingExaminationInfo mapHearingExaminationResult(
      HearingTestResult hearingTestResult) {
    boolean conspicuous =
        examinationResultsNotAllOk(Stream.of(hearingTestResult.getExaminationResult()));
    return new SchoolInfoLetterHearingExaminationInfo(
        conspicuous,
        mapClarificationArranged(Stream.of(hearingTestResult.getExaminationResult())),
        mapUnderTreatment(Stream.of(hearingTestResult.getExaminationResult())));
  }

  private static boolean mapClarificationArranged(Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(value -> value.equals(ExaminationResultValue.DOCTOR_LETTER));
  }

  private static boolean mapUnderTreatment(Stream<ExaminationResult> examinationResults) {
    return examinationResultValues(examinationResults)
        .anyMatch(value -> value.equals(ExaminationResultValue.KNOWN));
  }

  private static Stream<ExaminationResultValue> examinationResultValues(
      Stream<ExaminationResult> results) {
    return results
        .filter(Objects::nonNull)
        .map(ExaminationResult::getValue)
        .filter(Objects::nonNull);
  }

  private static SchoolInfoLetterTherapyAndPromotionInfo mapTherapyAndPromotionInfo(
      Anamnesis anamnesis) {
    return new SchoolInfoLetterTherapyAndPromotionInfo(
        anamnesis.getSpeechTherapy(),
        anamnesis.getErgotherapy(),
        anamnesis.getPhysiotherapy(),
        // currently hardcoded value (info source was not found)
        false,
        Optional.ofNullable(anamnesis.getAdditionalTherapies())
            .map(additionalTherapies -> !additionalTherapies.isEmpty())
            .orElse(false));
  }

  private static SchoolInfoLetterPhysiciansRecommendation mapPhysiciansRecommendation(
      DevelopmentScreening result, CreateSchoolInfoLetterRequest request) {
    SchoolRecommendation schoolRecommendation = result.getSchoolRecommendation();
    boolean prefilled = request.prefilled();
    return new SchoolInfoLetterPhysiciansRecommendation(
        prefilled
            ? schoolRecommendation.equals(SchoolRecommendation.CONCERNS_EARLY_ENROLMENT)
            : null,
        prefilled ? result.getSchoolCounselling() : null,
        prefilled ? schoolRecommendation.equals(SchoolRecommendation.ADVICE_CENTER) : null,
        prefilled ? mapPromotionOutsideSchool(result) : null,
        prefilled ? result.getOtherSupport() : null,
        request.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended());
  }

  private static boolean mapPromotionOutsideSchool(DevelopmentScreening result) {
    return Stream.of(
            result.getVaccinationAdvice(),
            result.getMotorPromotion(),
            result.getLanguageAdvice(),
            result.getNutritionalAdvice(),
            result.getEducationalAdvice())
        .filter(Objects::nonNull)
        .anyMatch(Boolean::booleanValue);
  }
}
