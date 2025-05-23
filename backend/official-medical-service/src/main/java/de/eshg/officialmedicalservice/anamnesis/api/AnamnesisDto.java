/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.anamnesis.api;

import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.CurrentHealthConditionInfoDto.OpticalAidAnswerDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.RecordComponent;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Schema(name = "Anamnesis")
public record AnamnesisDto(
    @NotNull @Valid AffectedPersonInfoDto affectedPersonInfo,
    @NotNull @Valid HealthFitnessAndDisabilityInfoDto healthFitnessAndDisabilityInfo,
    @NotNull @Valid RetirementInfoDto retirementInfo,
    @NotNull @Valid MedicalHistoryDto medicalHistoryInfo,
    @NotNull @Valid CurrentHealthConditionInfoDto currentHealthConditionInfo) {

  @Schema(name = "AffectedPersonInfo")
  public record AffectedPersonInfoDto(
      @NotNull FillingPersonDto fillingPerson,
      @NotNull MaritalStatusDto maritalStatus,
      @NotNull @PositiveOrZero int numberOfChildren,
      List<Integer> yearsOfBirthOfChildren, // can be null or empty if numberOfChildren is zero
      String occupation // not required
      ) {

    @Schema(name = "FillingPerson")
    public enum FillingPersonDto {
      EMPLOYEE,
      AFFECTED_PERSON,
      LEGAL_GUARDIAN,
      ;
    }

    @Schema(name = "MaritalStatus")
    public enum MaritalStatusDto {
      UNMARRIED,
      MARRIED,
      WIDOWED,
      DIVORCED,
      NO_SELECTION,
      ;
    }
  }

  @Schema(name = "HealthFitnessAndDisabilityInfo")
  public record HealthFitnessAndDisabilityInfoDto(
      @NotNull @Valid PriorExaminationSegmentDto priorExaminationInfo,
      @NotNull @Valid DisabilitySegmentDto disabilityInfo) {

    @Schema(name = "PriorExaminationSegment")
    public record PriorExaminationSegmentDto(
        @NotNull @Answer boolean hasPriorExaminations,
        @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes Integer year,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String place,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String reason,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String result)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "DisabilitySegment")
    public record DisabilitySegmentDto(
        @NotNull @Answer boolean hasDisability,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String reason,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String degree)
        implements ValidationBasedOnAnswer {}
  }

  @Schema(name = "RetirementInfo")
  public record RetirementInfoDto(
      @NotNull @Answer boolean appliedForRetirement,
      @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String reason,
      @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String reductionOfEarningCapacity)
      implements ValidationBasedOnAnswer {}

  @Schema(name = "MedicalHistory")
  public record MedicalHistoryDto(
      @NotNull @Answer boolean hadPastDiseasesOrDisabilities,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes HeartDiseaseSegmentDto heartDiseaseInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> nervousSystemInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerWhichStringDto<YesNoDontKnowAnswerDto> bonesJointsAndSpineInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> bladderKidneysAbdominalOrganInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerWhichStringDto<YesNoDontKnowAnswerDto>
              allergiesAndIntoleranceInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> earNoseThroatInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> bronchiaLungsInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes CancerSegmentDto cancerInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> stomachAndIntestinesInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> liverInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> diabetesInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerWhichEnumListDto<YesNoDontKnowAnswerDto, EatingDisorderDto>
              eatingDisorderInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes MentalIllnessSegmentDto mentalIllnessInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerWhichEnumListDto<YesNoDontKnowAnswerDto, ThyroidDiseaseDto>
              thyroidInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes AddictionsSegmentDto addictionsInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          SubInfoSegmentWithAnswerDto<YesNoDontKnowAnswerDto> tuberculosisInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes OverweightSegmentDto overweightInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes
          BoneFractureBrainTraumaSegmentDto boneFractureBrainTraumaInfo,
      @Valid @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes MiscellaneousSegmentDto miscellaneousInfo)
      implements ValidationBasedOnAnswer {

    @Schema(name = "HeartDiseaseSegment")
    public record HeartDiseaseSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotEmptyIfAnswerIsYes @NullOrEmptyIfAnswerIsNotYes List<@NotNull HeartDiseaseDto> which,
        @NullIfAnswerIsNotYes Boolean bypass,
        @NullIfAnswerIsNotYes Boolean stent)
        implements ValidationBasedOnAnswer {
      @AssertTrue
      private boolean isValidDependingOnWhich() {
        if (which == null || !which.contains(HeartDiseaseDto.CORONARY_HEART_DISEASE)) {
          return bypass == null && stent == null;
        } else {
          return bypass != null && stent != null;
        }
      }
    }

    @Schema(name = "CancerSegment")
    public record CancerSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String whichAndWhen,
        @NullIfAnswerIsNotYes Boolean chemoRadiationTherapy // Not required
        ) implements ValidationBasedOnAnswer {}

    @Schema(name = "MentalIllnessSegment")
    public record MentalIllnessSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String description,
        @NotEmptyIfAnswerIsYes @NullOrEmptyIfAnswerIsNotYes List<MentalIllnessDto> which)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "AddictionsSegment")
    public record AddictionsSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String description,
        @NotEmptyIfAnswerIsYes @NullOrEmptyIfAnswerIsNotYes List<AddictionDto> which,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String amount,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String since,
        @NullIfAnswerIsNotYes String notAnymoreSince // Not required
        ) implements ValidationBasedOnAnswer {}

    @Schema(name = "OverweightSegment")
    public record OverweightSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String description,
        @Positive @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes Double heightInCm,
        @Positive @NotNullIfAnswerIsYes @NullIfAnswerIsNotYes Double weightInKg)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "BoneFractureBrainTraumaSegment")
    public record BoneFractureBrainTraumaSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String description,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String whatWhenAndWhere)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "MiscellaneousSegment")
    public record MiscellaneousSegmentDto(
        @NotNull @Answer YesNoDontKnowAnswerDto answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String description)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "HeartDisease")
    public enum HeartDiseaseDto {
      HYPERTENSION_HYPOTENSION,
      CARDIAC_ARRHYTHMIA,
      CORONARY_HEART_DISEASE,
      HEART_ATTACK,
      STROKE,
      ;
    }

    @Schema(name = "EatingDisorder")
    public enum EatingDisorderDto {
      ANOREXIE_NERVOSA,
      BULIMIE_NERVOSA,
      ;
    }

    @Schema(name = "MentalIllness")
    public enum MentalIllnessDto {
      DEPRESSION,
      ANXIETY_DISORDER,
      SOMATIZATION_DISORDER,
      BORDERLINE,
      BIPOLAR_DISORDER,
      PSYCHOSIS,
      OBSESSIVE_COMPULSIVE_DISORDER;
    }

    @Schema(name = "ThyroidDisease")
    public enum ThyroidDiseaseDto {
      HYPOTHYREOSIS,
      NODULE,
      HYPERTHYREOISIS,
      HASHIMOTO_THYREOIDITIS,
      ;
    }

    @Schema(name = "Addiction")
    public enum AddictionDto {
      ALCOHOL,
      CANNABIS,
      NICOTINE,
      ILLEGAL_DRUGS,
      ;
    }
  }

  @Schema(name = "CurrentHealthConditionInfo")
  public record CurrentHealthConditionInfoDto(
      @NotNull @Valid CurrentMedicalConditionSegmentDto currentMedicalConditionsInfo,
      @NotNull @Valid MedicalImagingFindingsInfoSegmentDto medicalImagingFindingsInfo,
      @NotNull @Valid
          MedicationDietarySupplementsOrDrugsSegmentDto medicationDietarySupplementsOrDrugsInfo,
      @NotNull @Valid SubInfoSegmentWithAnswerDto<Boolean> healthyAndCapableInfo,
      @NotNull @Valid SportsSegmentDto sportsInfo,
      @NotNull @Valid SubInfoSegmentWithAnswerDto<OpticalAidAnswerDto> opticalAidInfo,
      @NotBlank String primaryCareDoctorOrAttendingPhysician) {

    @Schema(name = "CurrentMedicalConditionSegment")
    public record CurrentMedicalConditionSegmentDto(
        @NotNull @Answer boolean answer,
        @NotEmptyIfAnswerIsYes @NullOrEmptyIfAnswerIsNotYes
            List<@NotNull CurrentMedicalConditionDto> descriptionOfCondition,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String particulars)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "MedicalImagingFindingsInfoSegment")
    public record MedicalImagingFindingsInfoSegmentDto(
        @NotNull @Answer boolean answer, @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String result)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "MedicationDietarySupplementsOrDrugsSegment")
    public record MedicationDietarySupplementsOrDrugsSegmentDto(
        @NotNull @Answer boolean answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String substances)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "SportsSegment")
    public record SportsSegmentDto(
        @NotNull @Answer boolean answer,
        @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String formOfSport)
        implements ValidationBasedOnAnswer {}

    @Schema(name = "CurrentMedicalCondition")
    public enum CurrentMedicalConditionDto {
      ATTACKS,
      LACK_OF_APPETITE,
      SHORTNESS_OF_BREATH,
      JOINT_TROUBLE,
      EAR_NOSE_THROAT,
      HEART_TROUBLE,
      COUGH,
      HEADACHE,
      NIGHT_SWEATS,
      NERVOUS_TROUBLE,
      PAINFUL_URINATION,
      IMPAIRED_VISION_EYE_TROUBLE,
      MOOD_AND_MOTIVATION_SWINGS,
      WEIGHT_LOSS_OR_GAIN,
      RHEUMATIC_DISORDERS,
      BACK_PAIN,
      PAIN,
      HEARING_LOSS,
      INSOMNIA,
      VERTIGO,
      ADDICTION,
      INDIGESTION,
      TREMBLING,
      OTHER,
      NO_SELECTION;
    }

    @Schema(name = "OpticalAidAnswer")
    public enum OpticalAidAnswerDto {
      YES_GLASSES,
      YES_CONTACT_LENSES,
      NO,
      ;
    }
  }

  @Schema(name = "YesNoDontKnowAnswer")
  public enum YesNoDontKnowAnswerDto {
    YES,
    NO,
    DONT_KNOW,
    ;
  }

  @Schema(name = "SubInfoSegmentWithAnswer")
  public record SubInfoSegmentWithAnswerDto<AnswerType>(@NotNull @Valid AnswerType answer) {}

  @Schema(name = "SubInfoSegmentWithAnswerWhichString")
  public record SubInfoSegmentWithAnswerWhichStringDto<AnswerType>(
      @NotNull @Valid @Answer AnswerType answer,
      @NotBlankIfAnswerIsYes @NullIfAnswerIsNotYes String which)
      implements ValidationBasedOnAnswer {}

  @Schema(name = "SubInfoSegmentWithAnswerWhichEnumList")
  public record SubInfoSegmentWithAnswerWhichEnumListDto<
          AnswerType, EnumType extends Enum<EnumType>>(
      @NotNull @Valid @Answer AnswerType answer,
      @Valid @NotEmptyIfAnswerIsYes @NullOrEmptyIfAnswerIsNotYes List<EnumType> which)
      implements ValidationBasedOnAnswer {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface Answer {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface NotNullIfAnswerIsYes {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface NotEmptyIfAnswerIsYes {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface NotBlankIfAnswerIsYes {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface NullIfAnswerIsNotYes {}

  @Retention(RetentionPolicy.RUNTIME)
  public @interface NullOrEmptyIfAnswerIsNotYes {}

  interface ValidationBasedOnAnswer {
    @AssertTrue
    private boolean isValidDependingOnAnswer() {
      try {
        RecordComponent answerComponent =
            findRecordComponentsWithAnnotation(Answer.class).getFirst();

        Object answer = answerComponent.getAccessor().invoke(this);

        boolean answerIsTrue =
            Boolean.TRUE.equals(answer)
                || YesNoDontKnowAnswerDto.YES.equals(answer)
                || OpticalAidAnswerDto.YES_GLASSES.equals(answer)
                || OpticalAidAnswerDto.YES_CONTACT_LENSES.equals(answer);

        if (!answerIsTrue) {
          for (RecordComponent component :
              findRecordComponentsWithAnnotation(NullIfAnswerIsNotYes.class)) {
            if (component.getAccessor().invoke(this) != null) {
              return false;
            }
          }

          for (RecordComponent component :
              findRecordComponentsWithAnnotation(NullOrEmptyIfAnswerIsNotYes.class)) {
            Object value = component.getAccessor().invoke(this);
            if (value != null) {
              if (value instanceof Collection<?> collection) {
                if (!collection.isEmpty()) {
                  return false;
                }
              } else {
                return false;
              }
            }
          }
          return true;
        } else {
          for (RecordComponent component :
              findRecordComponentsWithAnnotation(NotNullIfAnswerIsYes.class)) {
            if (component.getAccessor().invoke(this) == null) {
              return false;
            }
          }

          for (RecordComponent component :
              findRecordComponentsWithAnnotation(NotEmptyIfAnswerIsYes.class)) {
            Object value = component.getAccessor().invoke(this);
            if (value != null) {
              if (value instanceof Collection<?> collection) {
                if (collection.isEmpty()) {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          }

          for (RecordComponent component :
              findRecordComponentsWithAnnotation(NotBlankIfAnswerIsYes.class)) {
            Object value = component.getAccessor().invoke(this);
            if (value != null) {
              if (value instanceof String string) {
                if (string.isBlank()) {
                  return false;
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        }
      } catch (Exception e) {
        e.printStackTrace();
        return false;
      }
    }

    private List<RecordComponent> findRecordComponentsWithAnnotation(Class<?> annotationClass) {
      return Arrays.stream(this.getClass().getRecordComponents())
          .filter(
              recordComponent ->
                  Arrays.stream(recordComponent.getAnnotations())
                      .anyMatch(annotation -> annotation.annotationType().equals(annotationClass)))
          .toList();
    }
  }
}
