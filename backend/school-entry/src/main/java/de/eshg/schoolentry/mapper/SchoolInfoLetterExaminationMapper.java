/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.schoolinfoletter.SaveSchoolInfoLetterRequest;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterExaminationTypeDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterEyeExaminationInfoDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterHearingExaminationInfoDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterMeaslesContraIndicationDurationDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterParentsWishDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterPhysiciansRecommendationDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterSchoolAndPromotionHintsDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterTherapyAndPromotionInfoDto;
import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterVaccinationInfoDto;
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

public class SchoolInfoLetterExaminationMapper {

  private SchoolInfoLetterExaminationMapper() {}

  public static SchoolInfoLetterExaminationTypeDto mapToData(SchoolInfoLetterExaminationType type) {
    return switch (type) {
      case REGULAR_EXAMINATION -> SchoolInfoLetterExaminationTypeDto.REGULAR_EXAMINATION;
      case CAN_CHILD -> SchoolInfoLetterExaminationTypeDto.CAN_CHILD;
      case ENTRY_LEVEL -> SchoolInfoLetterExaminationTypeDto.ENTRY_LEVEL;
    };
  }

  public static SchoolInfoLetterSchoolAndPromotionHintsDto mapToData(
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

  public static SchoolInfoLetterVaccinationInfoDto mapToData(
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

  public static SchoolInfoLetterEyeExaminationInfoDto mapToData(
      SchoolInfoLetterEyeExaminationInfo eyeExaminationInfo) {
    return new SchoolInfoLetterEyeExaminationInfoDto(
        eyeExaminationInfo.isConspicuous(),
        eyeExaminationInfo.isClarificationArranged(),
        eyeExaminationInfo.isSpectacleWearer(),
        eyeExaminationInfo.isUnderTreatment(),
        eyeExaminationInfo.isColorSenseDisorder());
  }

  public static SchoolInfoLetterHearingExaminationInfoDto mapToData(
      SchoolInfoLetterHearingExaminationInfo hearingExaminationInfo) {
    return new SchoolInfoLetterHearingExaminationInfoDto(
        hearingExaminationInfo.isConspicuous(),
        hearingExaminationInfo.isClarificationArranged(),
        hearingExaminationInfo.isUnderTreatment());
  }

  public static SchoolInfoLetterTherapyAndPromotionInfoDto mapToData(
      SchoolInfoLetterTherapyAndPromotionInfo therapyAndPromotionInfo) {
    return new SchoolInfoLetterTherapyAndPromotionInfoDto(
        therapyAndPromotionInfo.isSpeechTherapy(),
        therapyAndPromotionInfo.isErgoTherapy(),
        therapyAndPromotionInfo.isPhysioTherapy(),
        therapyAndPromotionInfo.isPsychoMotorSkills(),
        therapyAndPromotionInfo.isMiscellaneous());
  }

  public static SchoolInfoLetterPhysiciansRecommendationDto mapToData(
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

  public static SchoolInfoLetterParentsWishDto mapToData(SchoolInfoLetterParentsWish parentsWish) {
    return new SchoolInfoLetterParentsWishDto(
        parentsWish.getNote(), parentsWish.isReferredToFurtherConsultationFromSchool());
  }

  public static SchoolInfoLetterExamination mapToPersistence(SaveSchoolInfoLetterRequest request) {
    SchoolInfoLetterExamination schoolInfoLetter = new SchoolInfoLetterExamination();
    schoolInfoLetter.setExaminationType(mapToPersistence(request.type()));
    schoolInfoLetter.setPostponed(request.postponed());
    schoolInfoLetter.setSchoolAndPromotionHints(
        mapToPersistence(request.schoolAndPromotionHints()));
    schoolInfoLetter.setNote(request.note());
    schoolInfoLetter.setCustomRecommendation(request.customRecommendation());
    schoolInfoLetter.setVaccinationInfo(mapToPersistence(request.vaccinationInfo()));
    schoolInfoLetter.setEyeExaminationInfo(mapToPersistence(request.eyeExaminationInfo()));
    schoolInfoLetter.setHearingExaminationInfo(mapToPersistence(request.hearingExaminationInfo()));
    schoolInfoLetter.setConsultationWithCustodianRecommended(
        request.consultationWithCustodianRecommended());
    schoolInfoLetter.setTherapyAndPromotionInfo(
        mapToPersistence(request.therapyAndPromotionInfo()));
    schoolInfoLetter.setPhysiciansRecommendation(
        mapToPersistence(request.physiciansRecommendation()));
    schoolInfoLetter.setParentsWish(mapToPersistence(request.parentsWish()));
    return schoolInfoLetter;
  }

  private static SchoolInfoLetterExaminationType mapToPersistence(
      SchoolInfoLetterExaminationTypeDto dto) {
    return switch (dto) {
      case REGULAR_EXAMINATION -> SchoolInfoLetterExaminationType.REGULAR_EXAMINATION;
      case CAN_CHILD -> SchoolInfoLetterExaminationType.CAN_CHILD;
      case ENTRY_LEVEL -> SchoolInfoLetterExaminationType.ENTRY_LEVEL;
    };
  }

  private static SchoolInfoLetterSchoolAndPromotionHints mapToPersistence(
      SchoolInfoLetterSchoolAndPromotionHintsDto dto) {
    SchoolInfoLetterSchoolAndPromotionHints persistence =
        new SchoolInfoLetterSchoolAndPromotionHints();
    persistence.setBehavior(dto.behavior());
    persistence.setLanguage(dto.language());
    persistence.setArticulation(dto.articulation());
    persistence.setGrammarAndVocabulary(dto.grammarAndVocabulary());
    persistence.setAuditiveInformationProcessing(dto.auditiveInformationProcessing());
    persistence.setVisualPerception(dto.visualPerception());
    persistence.setColorsShapesNumbersSets(dto.colorsShapesNumbersSets());
    persistence.setFineOrVisuoMotorSkills(dto.fineOrVisuoMotorSkills());
    persistence.setGrossMotorSkillsOrPhysicalCoordination(
        dto.grossMotorSkillsOrPhysicalCoordination());
    persistence.setLeftHandedness(dto.leftHandedness());
    return persistence;
  }

  private static SchoolInfoLetterVaccinationInfo mapToPersistence(
      SchoolInfoLetterVaccinationInfoDto dto) {
    SchoolInfoLetterVaccinationInfo persistence = new SchoolInfoLetterVaccinationInfo();
    persistence.setVaccinationPassNotPresented(dto.vaccinationPassNotPresented());
    persistence.setMeaslesProtectionComplete(dto.measlesProtectionComplete());
    persistence.setMeaslesContraIndicationDuration(
        mapToPersistence(dto.measlesContraIndicationDuration()));
    persistence.setMeaslesContraIndicationUntil(dto.measlesContraIndicationUntil());
    return persistence;
  }

  private static SchoolInfoLetterMeaslesContraIndicationDuration mapToPersistence(
      SchoolInfoLetterMeaslesContraIndicationDurationDto dto) {
    return switch (dto) {
      case PERMANENT -> SchoolInfoLetterMeaslesContraIndicationDuration.PERMANENT;
      case TEMPORARY -> SchoolInfoLetterMeaslesContraIndicationDuration.TEMPORARY;
      case null -> null;
    };
  }

  private static SchoolInfoLetterEyeExaminationInfo mapToPersistence(
      SchoolInfoLetterEyeExaminationInfoDto dto) {
    SchoolInfoLetterEyeExaminationInfo persistence = new SchoolInfoLetterEyeExaminationInfo();
    persistence.setConspicuous(dto.conspicuous());
    persistence.setClarificationArranged(dto.clarificationArranged());
    persistence.setSpectacleWearer(dto.spectacleWearer());
    persistence.setUnderTreatment(dto.underTreatment());
    persistence.setColorSenseDisorder(dto.colorSenseDisorder());
    return persistence;
  }

  private static SchoolInfoLetterHearingExaminationInfo mapToPersistence(
      SchoolInfoLetterHearingExaminationInfoDto dto) {
    SchoolInfoLetterHearingExaminationInfo persistence =
        new SchoolInfoLetterHearingExaminationInfo();
    persistence.setConspicuous(dto.conspicuous());
    persistence.setClarificationArranged(dto.clarificationArranged());
    persistence.setUnderTreatment(dto.underTreatment());
    return persistence;
  }

  private static SchoolInfoLetterTherapyAndPromotionInfo mapToPersistence(
      SchoolInfoLetterTherapyAndPromotionInfoDto dto) {
    SchoolInfoLetterTherapyAndPromotionInfo persistence =
        new SchoolInfoLetterTherapyAndPromotionInfo();
    persistence.setSpeechTherapy(dto.speechTherapy());
    persistence.setErgoTherapy(dto.ergoTherapy());
    persistence.setPhysioTherapy(dto.physioTherapy());
    persistence.setPsychoMotorSkills(dto.psychoMotorSkills());
    persistence.setMiscellaneous(dto.miscellaneous());
    return persistence;
  }

  private static SchoolInfoLetterPhysiciansRecommendation mapToPersistence(
      SchoolInfoLetterPhysiciansRecommendationDto dto) {
    SchoolInfoLetterPhysiciansRecommendation persistence =
        new SchoolInfoLetterPhysiciansRecommendation();
    persistence.setConcernsCanChild(dto.concernsCanChild());
    persistence.setSpecialPromotion(dto.specialPromotion());
    persistence.setIntroductionInBFZ(dto.introductionInBFZ());
    persistence.setPromotionOutsideSchool(dto.promotionOutsideSchool());
    persistence.setFurtherMeasures(dto.furtherMeasures());
    persistence.setMeetingBetweenYouthHealthServicesAndSchoolManagementRecommended(
        dto.meetingBetweenYouthHealthServicesAndSchoolManagementRecommended());
    return persistence;
  }

  private static SchoolInfoLetterParentsWish mapToPersistence(SchoolInfoLetterParentsWishDto dto) {
    SchoolInfoLetterParentsWish persistence = new SchoolInfoLetterParentsWish();
    persistence.setNote(dto.note());
    persistence.setReferredToFurtherConsultationFromSchool(
        dto.referredToFurtherConsultationFromSchool());
    return persistence;
  }
}
