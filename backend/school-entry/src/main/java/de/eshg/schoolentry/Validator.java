/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.lib.procedure.util.ProcedureValidator.hasNonNullValue;
import static de.eshg.schoolentry.SchoolEntryCitizenController.MAX_ALLOWED_APPOINTMENT_CHANGES;
import static de.eshg.schoolentry.api.SopessExaminationResultValueDto.*;
import static de.eshg.schoolentry.util.ValueEvaluatorUtil.*;

import com.google.common.collect.Sets;
import de.cronn.commons.lang.StreamUtil;
import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.icd10.Icd10CodeApi;
import de.eshg.base.icd10.api.FindIcd10CodesRequest;
import de.eshg.base.icd10.api.FindIcd10CodesResponse;
import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.lib.appointmentblock.LocationSelectionMode;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockConfig;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.AnamnesisDto;
import de.eshg.schoolentry.api.anamnesis.DaycareAndSchoolInfoDto;
import de.eshg.schoolentry.api.citizen.CitizenAnamnesisDto;
import de.eshg.schoolentry.business.model.ChildData;
import de.eshg.schoolentry.business.model.ProcedureDetailsData;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.util.ExceptionUtil;
import java.beans.PropertyDescriptor;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class Validator {

  private static final List<
          TypedPropertyGetter<PhysicalExaminationDto, ExaminationWithDiagnosisDto>>
      EXAMINATION_WITH_DIAGNOSIS_PROPERTIES =
          List.of(
              PhysicalExaminationDto::getNutritionalCondition,
              PhysicalExaminationDto::getNeurology,
              PhysicalExaminationDto::getRespiratoryCardiovascular,
              PhysicalExaminationDto::getSkin,
              PhysicalExaminationDto::getMusculatureSkeleton,
              PhysicalExaminationDto::getMetabolism,
              PhysicalExaminationDto::getAbdomen,
              PhysicalExaminationDto::getEarNoseThroat);

  private final Icd10CodeApi icd10CodeClient;
  private final ContactClient contactClient;
  private final Clock clock;
  private final AppointmentBlockConfig appointmentBlockConfig;

  public Validator(
      Icd10CodeApi icd10CodeClient,
      ContactClient contactClient,
      Clock clock,
      AppointmentBlockConfig appointmentBlockConfig) {
    this.icd10CodeClient = icd10CodeClient;
    this.contactClient = contactClient;
    this.clock = clock;
    this.appointmentBlockConfig = appointmentBlockConfig;
  }

  static void validateOnlyOneOfSearchAndFilterParametersAreSet(
      ProcedureFilterParameters filterParameters, ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(filterParameters) && hasNonNullValue(searchParameters)) {
      throw new BadRequestException(
          "Filter parameters and search parameters can not be used in the same request.");
    }
  }

  public void validateSchoolYear(Year schoolYear) {
    if (schoolYear == null) {
      return;
    }
    Year currentYear = Year.now(clock);
    int numberOfYearsInFutureOrPast = Math.abs(schoolYear.getValue() - currentYear.getValue());
    if (numberOfYearsInFutureOrPast > 5) {
      throw new BadRequestException("Illegal school year: " + schoolYear);
    }
  }

  public void validateChildHasAddress(ChildData childData) {
    if (childData.address() == null) {
      throw new BadRequestException(
          "Appointment cannot be updated because child address is missing.");
    }
  }

  public static void validateUpdateHearingTestResult(HearingTestResultDto request) {
    validateExaminationResultConsistency(request, HearingTestResultDto::examinationResult);
  }

  public static void validateUpdateEyeExaminationResult(EyeExaminationResultDto request) {
    validateExaminationResultConsistency(request);
    validateDiagnosisFlagsAreSetOnlyIfResponseDoctorLetterIsConfirming(request);
  }

  public static void validateUpdateSopessExaminationResult(SopessExaminationResultDto request) {
    validatePoints(
        request,
        SopessExaminationResultDto::getGrossMotorSkills,
        ScoredEvaluationExaminationDto::points,
        JUMP_COUNT_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getFineMotorSkills,
        ScoredEvaluationExaminationDto::points,
        VISUO_MOTOR_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getVisualPerceptionResult,
        ScoredEvaluationExaminationDto::points,
        VISUAL_PERCEPTION_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getSpeechResult,
        SpeechEvaluationExaminationDto::prepositionPoints,
        PREPOSITION_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getSpeechResult,
        SpeechEvaluationExaminationDto::pluralPoints,
        PLURAL_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getAuditiveProcessingResult,
        ScoredEvaluationExaminationDto::points,
        PSEUDOWORD_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getKnowledgeThinkingResult,
        KnowledgeThinkingExaminationDto::countingPoints,
        COUNTING_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getKnowledgeThinkingResult,
        KnowledgeThinkingExaminationDto::quantityKnowledgePoints,
        QUANTITY_KNOWLEDGE_EVALUATION);
    validatePoints(
        request,
        SopessExaminationResultDto::getPsychologicalBehaviorResult,
        ScoredEvaluationExaminationDto::points,
        SELECTIVE_ATTENTION_EVALUATION);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getGrossMotorSkills);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getFineMotorSkills);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getVisualPerceptionResult);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getSpeechResult);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getAuditiveProcessingResult);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getKnowledgeThinkingResult);

    validateExaminationResultAndResponseDoctorLetterConsistency(
        request, SopessExaminationResultDto::getPsychologicalBehaviorResult);
  }

  public static void validateUpdateProcedureType(
      SchoolEntryProcedure procedure, ProcedureType requestedType) {
    if (procedure.isEntryLevel()
        && Objects.equals(procedure.getProcedureType(), ProcedureType.DRAFT_SCHOOL_IMPORT)
        && !Objects.equals(requestedType, ProcedureType.ENTRY_LEVEL)) {
      throw new BadRequestException(
          "Selected ProcedureType %s is not allowed.".formatted(requestedType));
    }
  }

  public static void validateLabelsExist(List<UUID> requestLabels, List<UUID> persistedLabels) {
    List<UUID> inexistentLabels =
        requestLabels.stream()
            .distinct()
            .filter(label -> !persistedLabels.contains(label))
            .toList();
    if (!inexistentLabels.isEmpty()) {
      throw new BadRequestException("Invalid labels: %s".formatted(inexistentLabels));
    }
  }

  public static void validateInvitationAppointmentIntegrity(
      boolean isInvitationSent, AppointmentDto appointment) {
    if (isInvitationSent && appointment == null) {
      throw new BadRequestException("Eine Einladung kann nicht ohne Termin versandt worden sein");
    }
  }

  private static <T> void validatePoints(
      SopessExaminationResultDto request,
      TypedPropertyGetter<SopessExaminationResultDto, T> examinationGetter,
      TypedPropertyGetter<T, Integer> pointsGetter,
      EvaluationExaminationRanges validRanges) {

    PropertyDescriptor examinationDescriptor =
        PropertyUtils.getPropertyDescriptor(request, examinationGetter);
    T evaluation = PropertyUtils.read(request, examinationDescriptor);

    PropertyDescriptor pointsDescriptor =
        PropertyUtils.getPropertyDescriptor(evaluation, pointsGetter);
    Integer points = PropertyUtils.read(evaluation, pointsDescriptor);

    if (validRanges.isInvalid(points)) {
      throw new BadRequestException(
          "Invalid value for %s.%s."
              .formatted(
                  examinationDescriptor.getDisplayName(), pointsDescriptor.getDisplayName()));
    }
  }

  private static void validateExaminationResultConsistency(EyeExaminationResultDto request) {
    List<TypedPropertyGetter<EyeExaminationResultDto, ExaminationResultDto>> propertiesToValidate =
        List.of(
            EyeExaminationResultDto::eyeExamination,
            EyeExaminationResultDto::langExamination,
            EyeExaminationResultDto::ishiharaExamination);

    for (TypedPropertyGetter<EyeExaminationResultDto, ExaminationResultDto> getter :
        propertiesToValidate) {
      validateExaminationResultConsistency(request, getter);
    }
  }

  private static <T> void validateExaminationResultConsistency(
      T request, TypedPropertyGetter<T, ExaminationResultDto> getter) {
    ExaminationResultDto examinationResultDto = getter.get(request);
    PropertyDescriptor propertyDescriptor = PropertyUtils.getPropertyDescriptor(request, getter);

    if (examinationResultDto.examinationResultValue() == ExaminationResultValueDto.DOCTOR_LETTER
        && examinationResultDto.doctorLetterValue() == null) {
      throw new BadRequestException(
          "%s: responseDoctorLetter must be set when examinationResultValue is %s"
              .formatted(
                  propertyDescriptor.getDisplayName(),
                  ExaminationResultValueDto.DOCTOR_LETTER.name()));
    }
    if (examinationResultDto.examinationResultValue() != ExaminationResultValueDto.DOCTOR_LETTER
        && examinationResultDto.doctorLetterValue() != null) {
      throw new BadRequestException(
          "%s: responseDoctorLetter must not be set when examinationResultValue is not %s"
              .formatted(
                  propertyDescriptor.getDisplayName(),
                  ExaminationResultValueDto.DOCTOR_LETTER.name()));
    }
  }

  private static void validateDiagnosisFlagsAreSetOnlyIfResponseDoctorLetterIsConfirming(
      EyeExaminationResultDto request) {
    DoctorLetterValueDto responseDoctorLetter = request.eyeExamination().doctorLetterValue();
    if (responseDoctorLetter == DoctorLetterValueDto.CONFIRMED
        || responseDoctorLetter == DoctorLetterValueDto.PARTIALLY_CONFIRMED) {
      return;
    }
    if (request.amblyopia()
        || request.astigmatism()
        || request.colorVisionDisorder()
        || request.hyperopia()
        || request.myopia()
        || request.strabismus()
        || request.otherDiagnosis()) {
      throw new BadRequestException(
          "Diagnosis flags must not be set when responseDoctorLetter is neither %s nor %s."
              .formatted(
                  DoctorLetterValueDto.CONFIRMED.name(),
                  DoctorLetterValueDto.PARTIALLY_CONFIRMED.name()));
    }
  }

  private static void validateExaminationResultAndResponseDoctorLetterConsistency(
      SopessExaminationResultDto request,
      TypedPropertyGetter<SopessExaminationResultDto, HasEvaluationExamination> evaluationGetter) {

    PropertyDescriptor examinationDescriptor =
        PropertyUtils.getPropertyDescriptor(request, evaluationGetter);
    HasEvaluationExamination examination = PropertyUtils.read(request, examinationDescriptor);

    PropertyDescriptor evaluationDescriptor =
        PropertyUtils.getPropertyDescriptor(examination, HasEvaluationExamination::evaluation);
    EvaluationExaminationDto evaluation = examination.evaluation();

    PropertyDescriptor resultDescriptor =
        PropertyUtils.getPropertyDescriptor(
            evaluation, EvaluationExaminationDto::examinationResultValue);
    SopessExaminationResultValueDto result = evaluation.examinationResultValue();

    DoctorLetterValueDto doctorLetter = evaluation.doctorLetterValue();
    PropertyDescriptor doctorLetterDescriptor =
        PropertyUtils.getPropertyDescriptor(
            evaluation, EvaluationExaminationDto::doctorLetterValue);

    if (result == DOCTOR_LETTER && doctorLetter == null) {
      throw doctorLetterInconsistentException(
          true,
          examinationDescriptor,
          evaluationDescriptor,
          doctorLetterDescriptor,
          resultDescriptor);
    }

    if (result != DOCTOR_LETTER && doctorLetter != null) {
      throw doctorLetterInconsistentException(
          false,
          examinationDescriptor,
          evaluationDescriptor,
          doctorLetterDescriptor,
          resultDescriptor);
    }
  }

  private static BadRequestException doctorLetterInconsistentException(
      boolean doctorLetterExpected,
      PropertyDescriptor examination,
      PropertyDescriptor evaluation,
      PropertyDescriptor doctorLetter,
      PropertyDescriptor result) {
    String message;
    if (doctorLetterExpected) {
      message = "%s.%s.%s must be set when %s.%s.%s is %s";
    } else {
      message = "%s.%s.%s must not be set when %s.%s.%s is not %s";
    }

    return new BadRequestException(
        message.formatted(
            examination.getDisplayName(),
            evaluation.getDisplayName(),
            doctorLetter.getDisplayName(),
            examination.getDisplayName(),
            evaluation.getDisplayName(),
            result.getDisplayName(),
            DOCTOR_LETTER.name()));
  }

  public void validateUpdateDevelopmentScreeningResult(DevelopmentScreeningResultDto request) {
    validateWeight(request.measurements().weight());
    validateHeight(request.measurements().height());

    validateExaminationResultConsistency(request.physicalExamination());
    validateHandicapConsistency(request.handicap());

    List<String> icd10Codes = collectIcd10Codes(request);
    validateIcd10CodesExist(icd10Codes);
  }

  private static List<String> collectIcd10Codes(DevelopmentScreeningResultDto request) {
    return Stream.concat(
            collectIcd10Codes(request.handicap()), collectIcd10Codes(request.physicalExamination()))
        .distinct()
        .toList();
  }

  static void validateWeight(Double weight) {
    if (weight != null && (weight <= 0 || weight >= 1000)) {
      throw new BadRequestException("Weight must be larger than 0 and smaller than 1000.");
    }
  }

  static void validateHeight(Integer height) {
    if (height != null && (height <= 0 || height >= 1000)) {
      throw new BadRequestException("Height must be larger than 0 and smaller than 1000.");
    }
  }

  private static void validateExaminationResultConsistency(
      PhysicalExaminationDto physicalExamination) {
    for (TypedPropertyGetter<PhysicalExaminationDto, ExaminationWithDiagnosisDto> propertyGetter :
        EXAMINATION_WITH_DIAGNOSIS_PROPERTIES) {
      ExaminationWithDiagnosisDto examinationWithDiagnosis =
          propertyGetter.get(physicalExamination);
      if (examinationWithDiagnosis != null) {
        validateExaminationResultConsistency(
            examinationWithDiagnosis, ExaminationWithDiagnosisDto::examinationResult);
        validateExaminationWithDiagnosisConsistency(examinationWithDiagnosis);
      }
    }
  }

  private static void validateExaminationWithDiagnosisConsistency(
      ExaminationWithDiagnosisDto examinationWithDiagnosis) {
    if (examinationWithDiagnosis == null
        || examinationWithDiagnosis.examinationResult() == null
        || examinationWithDiagnosis.examinationResult().examinationResultValue() == null) {
      return;
    }
    ExaminationResultValueDto result =
        examinationWithDiagnosis.examinationResult().examinationResultValue();
    if ((result == ExaminationResultValueDto.OK || result == ExaminationResultValueDto.UNKNOWN)
        && !CollectionUtils.isEmpty(examinationWithDiagnosis.icd10Codes())) {
      throw new BadRequestException(
          "ICD-10 Codes may not be set when examination result is %s or %s."
              .formatted(
                  ExaminationResultValueDto.OK.name(), ExaminationResultValueDto.UNKNOWN.name()));
    }
  }

  private static void validateHandicapConsistency(HandicapDto handicap) {
    validateHandicapWithDiagnosisConsistency(handicap.chronicDisease());
    validateHandicapWithDiagnosisConsistency(handicap.disability());

    if (BooleanUtils.isFalse(handicap.disability().result()) && handicap.disabilityType() != null) {
      throw new BadRequestException(
          "DisabilityType may not be set when disability.result is false.");
    }
  }

  private static void validateHandicapWithDiagnosisConsistency(
      HandicapWithDiagnosisDto handicapWithDiagnosis) {
    if (BooleanUtils.isFalse(handicapWithDiagnosis.result())
        && !CollectionUtils.isEmpty(handicapWithDiagnosis.icd10Codes())) {
      throw new BadRequestException("ICD-10 Codes may not be set when result is false.");
    }
  }

  private static Stream<String> collectIcd10Codes(PhysicalExaminationDto physicalExaminationDto) {
    return EXAMINATION_WITH_DIAGNOSIS_PROPERTIES.stream()
        .map(propertyGetter -> propertyGetter.get(physicalExaminationDto))
        .filter(Objects::nonNull)
        .map(ExaminationWithDiagnosisDto::icd10Codes)
        .flatMap(Collection::stream)
        .map(Icd10CodeWithOriginalCodeDto::code);
  }

  private static Stream<String> collectIcd10Codes(HandicapDto handicap) {
    return Stream.concat(
        streamNullable(handicap.chronicDisease().icd10Codes())
            .map(Icd10CodeWithOriginalCodeDto::code),
        streamNullable(handicap.disability().icd10Codes()).map(Icd10CodeWithOriginalCodeDto::code));
  }

  private static Stream<Icd10CodeWithOriginalCodeDto> streamNullable(
      List<Icd10CodeWithOriginalCodeDto> icd10Codes) {
    if (icd10Codes == null) {
      return Stream.empty();
    }
    return icd10Codes.stream();
  }

  private void validateIcd10CodesExist(Collection<String> icd10Codes) {
    Set<String> missingCodes = validateIcd10Codes(icd10Codes);
    if (!missingCodes.isEmpty()) {
      throw new BadRequestException("ICD-10 codes %s do not exist.".formatted(missingCodes));
    }
  }

  public Set<String> validateIcd10Codes(Collection<String> icd10Codes) {
    if (icd10Codes.isEmpty()) {
      return Set.of();
    }
    FindIcd10CodesResponse validateResponse =
        icd10CodeClient.findAllIcd10Codes(new FindIcd10CodesRequest(new ArrayList<>(icd10Codes)));

    Set<String> existingCodes =
        validateResponse.existingCodes().stream()
            .map(Icd10CodeDto::code)
            .collect(StreamUtil.toLinkedHashSet());

    return Sets.difference(new LinkedHashSet<>(icd10Codes), existingCodes);
  }

  public void validateLocationIdForImport(UUID locationId) {
    if (appointmentBlockConfig.getLocationSelectionMode()
        == LocationSelectionMode.HEALTH_DEPARTMENT) {
      if (locationId == null) {
        throw ExceptionUtil.badRequestExceptionMissingLocationId();
      }
      validateHealthDepartmentExists(locationId);
    } else {
      if (locationId != null) {
        throw ExceptionUtil.badRequestExceptionForbiddenLocationId();
      }
    }
  }

  public void validateSchoolExists(UUID schoolId) {
    contactClient.validateContactIsInstitutionWithCategory(
        schoolId, InstitutionContactCategoryDto.SCHOOL);
  }

  public void validateHealthDepartmentExists(UUID locationId) {
    contactClient.validateContactIsInstitutionWithCategory(
        locationId, InstitutionContactCategoryDto.HEALTH_DEPARTMENT);
  }

  public void validateAnamnesis(AnamnesisDto anamnesis) {
    validateDateTodayOrPast(anamnesis.migrationBackground().inGermanySince());
    validateDayCareInfoConsistency(anamnesis.daycareAndSchoolInfo());
  }

  public void validateCitizenAnamnesis(CitizenAnamnesisDto anamnesis) {
    validateDateTodayOrPast(anamnesis.migrationBackground().inGermanySince());
    validateDayCareInfoConsistency(anamnesis.daycareAndSchoolInfo());
  }

  void validateDateTodayOrPast(LocalDate date) {
    if (date == null) {
      return;
    }
    if (date.isAfter(LocalDate.now(clock))) {
      throw new BadRequestException("The date must be in the past.");
    }
  }

  void validateDayCareInfoConsistency(DaycareAndSchoolInfoDto daycareInfo) {
    if (!Boolean.TRUE.equals(daycareInfo.wasInDaycare())
        && (daycareInfo.inDaycareSince() != null || daycareInfo.daycareName() != null)) {
      throw new BadRequestException(
          "In daycare info provided despite child not having been in daycare");
    }
  }

  void validateAppointmentChanges(SchoolEntryProcedure schoolEntryProcedure) {
    if (schoolEntryProcedure.getAppointmentChangesByCitizen() >= MAX_ALLOWED_APPOINTMENT_CHANGES) {
      throw new BadRequestException(
          "More than %d appointment changes are not allowed by citizens"
              .formatted(MAX_ALLOWED_APPOINTMENT_CHANGES));
    }
  }

  static void validateProcedureStatusIsClosed(SchoolEntryProcedure procedure) {
    if (!ProcedureStatus.isClosed(procedure.getProcedureStatus())) {
      throw new BadRequestException(
          "Procedure %s is not closed and cannot be reopened."
              .formatted(procedure.getExternalId()));
    }
  }

  static void validateHasAppointment(SchoolEntryProcedure procedure) {
    if (procedure.getAppointment() == null) {
      throw new BadRequestException(
          "Procedure %s has no appointment and waiting room details cannot be updated."
              .formatted(procedure.getExternalId()));
    }
  }

  static void validateDeletionOfProcedure(ProcedureDetailsData procedureDetailsData) {
    if (!procedureDetailsData.isDeletable()) {
      throw new BadRequestException(
          "Procedure %s cannot be deleted.".formatted(procedureDetailsData.externalId()));
    }
  }

  static void validateSchoolInfoLetterCreated(SchoolEntryProcedure procedure) {
    if (procedure.getSchoolInfoLetterCreatedAt() == null) {
      throw new BadRequestException(
          "A school info letter must be created before the procedure can be closed.");
    }
  }
}
