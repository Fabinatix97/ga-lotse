/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.statistics;

import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import de.eshg.officialmedicalservice.anamnesis.AnamnesisMapper;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.AffectedPersonInfoDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.CurrentMedicalConditionSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.MedicalImagingFindingsInfoSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.MedicationDietarySupplementsOrDrugsSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.SportsSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.HealthFitnessAndDisabilityInfoDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.HealthFitnessAndDisabilityInfoDto.DisabilitySegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.HealthFitnessAndDisabilityInfoDto.PriorExaminationSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.AddictionsSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.BoneFractureBrainTraumaSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.CancerSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.HeartDiseaseSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.MentalIllnessSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.MedicalHistoryDto.OverweightSegmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.RetirementInfoDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.SubInfoSegmentWithAnswerDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.SubInfoSegmentWithAnswerWhichEnumListDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.SubInfoSegmentWithAnswerWhichStringDto;
import de.eshg.officialmedicalservice.anamnesis.persistence.entity.OmsAnamnesis;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingState;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure_;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OmsProcedureDataSource
    extends ProcedureDataSource<OmsProcedure, OmsProcedureAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("07d387be-ba7b-4925-a892-946f2da0a6da");
  public static final String DATA_SOURCE_NAME = "Amtsärztliches Gutachten";

  private final AnamnesisMapper anamnesisMapper;

  public OmsProcedureDataSource(
      OmsProcedureRepository omsProcedureRepository, AnamnesisMapper anamnesisMapper) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.INTERNAL_USAGE,
        null,
        omsProcedureRepository,
        OmsProcedureAttributes.values());
    this.anamnesisMapper = anamnesisMapper;
  }

  @Override
  protected Object mapSpecificValue(
      OmsProcedure procedure, OmsProcedureAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case STATUS -> procedure.getProcedureStatus().toString();
      case CONCERN -> procedure.getConcern() != null ? procedure.getConcern().getNameDe() : null;
      case CONCERN_CATEGORY ->
          procedure.getConcern() != null ? procedure.getConcern().getCategoryNameDe() : null;
      case DURATION -> getDurationInMinutes(procedure);
      case PERSON_CENTRAL_FILE_ID -> procedure.findAffectedPerson().getCentralFileStateId();
      case NUMBER_OF_DOCUMENTS -> procedure.getDocuments().size();
      case NUMBER_OF_APPOINTMENTS -> procedure.getAppointments().size();
      case NUMBER_OF_BOOKED_APPOINTMENTS ->
          procedure.getAppointments().stream()
              .filter(appointment -> BookingState.BOOKED.equals(appointment.getBookingState()))
              .count();
      case NUMBER_OF_CANCELLED_APPOINTMENTS ->
          procedure.getAppointments().stream()
              .filter(appointment -> BookingState.CANCELLED.equals(appointment.getBookingState()))
              .count();
      case MEDICAL_OPINION_RESULT -> procedure.getMedicalOpinionResult().toString();
      case AFFECTED_PERSON_INFO_FILLING_PERSON ->
          getOptionalAffectedPersonInfo(procedure)
              .map(AffectedPersonInfoDto::fillingPerson)
              .map(Enum::toString)
              .orElse(null);
      case AFFECTED_PERSON_INFO_MARITAL_STATUS ->
          getOptionalAffectedPersonInfo(procedure)
              .map(AffectedPersonInfoDto::maritalStatus)
              .map(Enum::toString)
              .orElse(null);
      case AFFECTED_PERSON_INFO_NUMBER_OF_CHILDREN ->
          getOptionalAffectedPersonInfo(procedure)
              .map(AffectedPersonInfoDto::numberOfChildren)
              .orElse(null);
      case AFFECTED_PERSON_INFO_OCCUPATION ->
          getOptionalAffectedPersonInfo(procedure)
              .map(AffectedPersonInfoDto::occupation)
              .orElse(null);
      case HEALTH_FITNESS_AND_DISABILITY_INFO_PRIOR_EXAMINATIONS_SEGMENT_HAS_PRIOR_EXAMINATIONS ->
          getOptionalHealthFitnessAndDisabilityInfo(procedure)
              .map(HealthFitnessAndDisabilityInfoDto::priorExaminationInfo)
              .map(PriorExaminationSegmentDto::hasPriorExaminations)
              .orElse(null);
      case HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_HAS_DISABILITY ->
          getOptionalHealthFitnessAndDisabilityInfo(procedure)
              .map(HealthFitnessAndDisabilityInfoDto::disabilityInfo)
              .map(DisabilitySegmentDto::hasDisability)
              .orElse(null);
      case HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_DEGREE ->
          getOptionalHealthFitnessAndDisabilityInfo(procedure)
              .map(HealthFitnessAndDisabilityInfoDto::disabilityInfo)
              .map(DisabilitySegmentDto::degree)
              .orElse(null);
      case RETIREMENT_INFO_APPLIED_FOR_RETIREMENT ->
          getOptionalRetirementInfo(procedure)
              .map(RetirementInfoDto::appliedForRetirement)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_HAD_PAST_DISEASES_OR_DISABILITIES ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::hadPastDiseasesOrDisabilities)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::heartDiseaseInfo)
              .map(HeartDiseaseSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_BYPASS ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::heartDiseaseInfo)
              .map(HeartDiseaseSegmentDto::bypass)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_STENT ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::heartDiseaseInfo)
              .map(HeartDiseaseSegmentDto::stent)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_NERVOUS_SYSTEM_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::nervousSystemInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_BONES_JOINTS_AND_SPINES_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::bonesJointsAndSpineInfo)
              .map(SubInfoSegmentWithAnswerWhichStringDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_BLADDER_KIDNEYS_ABDOMINAL_ORGAN_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::bladderKidneysAbdominalOrganInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_ALLERGIES_AND_INTOLERANCE_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::allergiesAndIntoleranceInfo)
              .map(SubInfoSegmentWithAnswerWhichStringDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_EARS_NOSE_AND_THROAT_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::earNoseThroatInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_BRONCHIAL_LUNGS_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::bronchiaLungsInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_CANCER_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::cancerInfo)
              .map(CancerSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_CANCER_INFO_WHICH_AND_WHEN ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::cancerInfo)
              .map(CancerSegmentDto::whichAndWhen)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_CANCER_INFO_CHEMO_RADIATION_THERAPY ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::cancerInfo)
              .map(CancerSegmentDto::chemoRadiationTherapy)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_STOMACH_AND_INTESTINES_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::stomachAndIntestinesInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_LIVER_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::liverInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_DIABETES_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::diabetesInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_EATING_DISORDER_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::eatingDisorderInfo)
              .map(SubInfoSegmentWithAnswerWhichEnumListDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_MENTAL_ILLNESS_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::mentalIllnessInfo)
              .map(MentalIllnessSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_THYROID_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::thyroidInfo)
              .map(SubInfoSegmentWithAnswerWhichEnumListDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::addictionsInfo)
              .map(AddictionsSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_AMOUNT ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::addictionsInfo)
              .map(AddictionsSegmentDto::amount)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_SINCE ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::addictionsInfo)
              .map(AddictionsSegmentDto::since)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_NOT_ANYMORE_SINCE ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::addictionsInfo)
              .map(AddictionsSegmentDto::notAnymoreSince)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_TUBERCULOSIS_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::tuberculosis)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::overweightInfo)
              .map(OverweightSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_HEIGHT_IN_CM ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::overweightInfo)
              .map(OverweightSegmentDto::heightInCm)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_WEIGHT_IN_KG ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::overweightInfo)
              .map(OverweightSegmentDto::weightInKg)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_ANSWER ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::boneFractureBrainTraumaInfo)
              .map(BoneFractureBrainTraumaSegmentDto::answer)
              .map(Enum::toString)
              .orElse(null);
      case MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_DESCRIPTION ->
          getOptionalMedicalHistoryInfo(procedure)
              .map(MedicalHistoryDto::boneFractureBrainTraumaInfo)
              .map(BoneFractureBrainTraumaSegmentDto::description)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_CURRENT_MEDICAL_CONDITIONS_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::currentMedicalConditionsInfo)
              .map(CurrentMedicalConditionSegmentDto::answer)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::medicalImagingFindingsInfo)
              .map(MedicalImagingFindingsInfoSegmentDto::answer)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_RESULT ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::medicalImagingFindingsInfo)
              .map(MedicalImagingFindingsInfoSegmentDto::result)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::medicationDietarySupplementsOrDrugsInfo)
              .map(MedicationDietarySupplementsOrDrugsSegmentDto::answer)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_SUBSTANCES ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::medicationDietarySupplementsOrDrugsInfo)
              .map(MedicationDietarySupplementsOrDrugsSegmentDto::substances)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_HEALTHY_AND_CAPABLE_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::healthyAndCapableInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::sportsInfo)
              .map(SportsSegmentDto::answer)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_FORM_OF_SPORT ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::sportsInfo)
              .map(SportsSegmentDto::formOfSport)
              .orElse(null);
      case CURRENT_HEALTH_CONDITION_INFO_OPTICAL_AID_INFO_ANSWER ->
          getOptionalCurrentHealthConditionInfo(procedure)
              .map(CurrentHealthConditionInfoDto::opticalAidInfo)
              .map(SubInfoSegmentWithAnswerDto::answer)
              .map(Enum::toString)
              .orElse(null);
    };
  }

  private Optional<AnamnesisDto> getOptionalAnamnesis(OmsProcedure procedure) {
    return Optional.ofNullable(procedure.getAnamnesis())
        .map(OmsAnamnesis::getContent)
        .map(anamnesisMapper::bytesToAnamnesis);
  }

  private Optional<AffectedPersonInfoDto> getOptionalAffectedPersonInfo(OmsProcedure procedure) {
    return getOptionalAnamnesis(procedure).map(AnamnesisDto::affectedPersonInfo);
  }

  private Optional<HealthFitnessAndDisabilityInfoDto> getOptionalHealthFitnessAndDisabilityInfo(
      OmsProcedure procedure) {
    return getOptionalAnamnesis(procedure).map(AnamnesisDto::healthFitnessAndDisabilityInfo);
  }

  private Optional<RetirementInfoDto> getOptionalRetirementInfo(OmsProcedure procedure) {
    return getOptionalAnamnesis(procedure).map(AnamnesisDto::retirementInfo);
  }

  private Optional<MedicalHistoryDto> getOptionalMedicalHistoryInfo(OmsProcedure procedure) {
    return getOptionalAnamnesis(procedure).map(AnamnesisDto::medicalHistoryInfo);
  }

  private Optional<CurrentHealthConditionInfoDto> getOptionalCurrentHealthConditionInfo(
      OmsProcedure procedure) {
    return getOptionalAnamnesis(procedure).map(AnamnesisDto::currentHealthConditionInfo);
  }

  @Override
  protected Specification<OmsProcedure> getProcedureSpecification(TimeRange timeRange) {
    return (root, query, criteriaBuilder) ->
        isInTimeRange(criteriaBuilder, root.get(OmsProcedure_.createdAt), timeRange);
  }

  private Long getDurationInMinutes(OmsProcedure procedure) {
    if (procedure.getStartedAt() == null || procedure.getClosedAt() == null) {
      return null;
    }
    return Duration.between(procedure.getStartedAt(), procedure.getClosedAt()).toMinutes();
  }
}
