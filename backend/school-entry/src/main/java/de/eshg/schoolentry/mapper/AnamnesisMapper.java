/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.*;
import de.eshg.schoolentry.api.citizen.CitizenAnamnesisDto;
import de.eshg.schoolentry.api.citizen.CitizenMigrationBackgroundDto;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.BooleanWithUnknown;
import de.eshg.schoolentry.domain.model.MediaConsumption;
import de.eshg.schoolentry.domain.model.SchoolEntryCountryCode;
import jakarta.annotation.Nullable;

public class AnamnesisMapper {

  private AnamnesisMapper() {}

  public static AnamnesisDto mapToDto(Anamnesis anamnesis) {
    if (anamnesis == null) {
      return null;
    }

    return new AnamnesisDto(
        anamnesis.getVersion(),
        anamnesis.getChildLanguageScreening(),
        anamnesis.getLanguageScreeningConsent(),
        anamnesis.getPreliminaryCourse(),
        new CheckUpsDto(
            mapToDto(anamnesis.getU2()),
            mapToDto(anamnesis.getU3()),
            mapToDto(anamnesis.getU4()),
            mapToDto(anamnesis.getU5()),
            mapToDto(anamnesis.getU6()),
            mapToDto(anamnesis.getU7()),
            mapToDto(anamnesis.getU7a()),
            mapToDto(anamnesis.getU8()),
            mapToDto(anamnesis.getU9())),
        new PromotionBeforeSchoolEntryDto(
            anamnesis.getEarlySupport(),
            anamnesis.getIntegrationPlace(),
            anamnesis.getErgotherapy(),
            anamnesis.getSpeechTherapy(),
            anamnesis.getPhysiotherapy()),
        new MigrationBackgroundDto(
            mapToDto(anamnesis.getNationalityChild()),
            mapToDto(anamnesis.getCountryOfBirthChild()),
            mapToDto(anamnesis.getNationalityFirstParent()),
            mapToDto(anamnesis.getCountryOfBirthFirstParent()),
            mapToDto(anamnesis.getNationalitySecondParent()),
            mapToDto(anamnesis.getCountryOfBirthSecondParent()),
            anamnesis.getHasMigrationBackground(),
            anamnesis.getInGermanySince()),
        new AdditionalChildInfoDto(
            anamnesis.getResponsiblePhysician(),
            anamnesis.getNumberOfSiblings(),
            anamnesis.getSiblingsBirthYears()),
        new DaycareAndSchoolInfoDto(
            anamnesis.getWasInDaycare(),
            anamnesis.getInDaycareSince(),
            anamnesis.getDaycareName(),
            anamnesis.getSchoolName()),
        new FamilyHistoryInfoDto(
            anamnesis.getSpectaclesInFamily(), anamnesis.getChronicIllnessOrDisabilityInFamily()),
        new DevelopmentInfoDto(
            anamnesis.getDevelopmentConspicuities(),
            anamnesis.getInfancyConspicuities(),
            anamnesis.getGestationalAge(),
            anamnesis.getBirthWeight(),
            anamnesis.getDailyTeethBrushing(),
            anamnesis.getTeethBrushingAfterCare(),
            anamnesis.getElectricToothBrush(),
            anamnesis.getFluorideToothPaste()),
        new IllnessAndAccidentInfoDto(
            anamnesis.getSevereIllnesses(),
            anamnesis.getAllergies(),
            anamnesis.getHospitalizationsOrOperations(),
            anamnesis.getUnderMedicalTreatmentFor(),
            anamnesis.getRegularMedication()),
        new PromotionTherapyAndAidInfoDto(
            anamnesis.getVisionImpairment(),
            anamnesis.getHearingImpairment(),
            anamnesis.getSpeechImpairment(),
            anamnesis.getSpectaclesSince(),
            anamnesis.getVisionSchoolSince(),
            anamnesis.getHearingAid(),
            anamnesis.getSpeechTherapyStart(),
            anamnesis.getSpeechTherapyEnd(),
            anamnesis.getErgoTherapyStart(),
            anamnesis.getErgoTherapyEnd(),
            anamnesis.getPhysioTherapyStart(),
            anamnesis.getPhysioTherapyEnd(),
            anamnesis.getAdditionalTherapies()),
        new InterestsAndSportsInfoDto(
            anamnesis.getClubSport(),
            anamnesis.getOtherInterests(),
            anamnesis.getCanSwim(),
            anamnesis.getHasSeahorseBadge(),
            mapToDto(anamnesis.getMediaConsumption())),
        anamnesis.getPersonalConspicuities(),
        anamnesis.getNote());
  }

  private static MediaConsumptionDto mapToDto(MediaConsumption mediaConsumption) {
    if (mediaConsumption == null) {
      return null;
    }
    return switch (mediaConsumption) {
      case LITTLE -> MediaConsumptionDto.LITTLE;
      case MEDIUM -> MediaConsumptionDto.MEDIUM;
      case MUCH -> MediaConsumptionDto.MUCH;
    };
  }

  private static CountryCodeDto mapToDto(SchoolEntryCountryCode nationalityChild) {
    if (nationalityChild == null) {
      return null;
    }
    return CountryCodeDto.valueOf(nationalityChild.name());
  }

  private static BooleanWithUnknownDto mapToDto(BooleanWithUnknown value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknownDto.TRUE;
      case FALSE -> BooleanWithUnknownDto.FALSE;
      case UNKNOWN -> BooleanWithUnknownDto.UNKNOWN;
    };
  }

  public static Anamnesis mapToDomain(AnamnesisDto dto) {
    if (dto == null) {
      return null;
    }

    Anamnesis anamnesis = new Anamnesis();
    anamnesis.setChildLanguageScreening(dto.childLanguageScreening());
    anamnesis.setLanguageScreeningConsent(dto.languageScreeningConsent());
    anamnesis.setPreliminaryCourse(dto.preliminaryCourse());
    anamnesis.setBirthWeight(dto.developmentInfo().birthWeight());
    anamnesis.setDailyTeethBrushing(dto.developmentInfo().dailyTeethBrushing());
    anamnesis.setTeethBrushingAfterCare(dto.developmentInfo().teethBrushingAfterCare());
    anamnesis.setElectricToothBrush(dto.developmentInfo().electricToothBrush());
    anamnesis.setFluorideToothPaste(dto.developmentInfo().fluorideToothPaste());
    anamnesis.setGestationalAge(dto.developmentInfo().gestationalAge());
    anamnesis.setDevelopmentConspicuities(dto.developmentInfo().developmentConspicuities());
    anamnesis.setInfancyConspicuities(dto.developmentInfo().infancyConspicuities());
    anamnesis.setWasInDaycare(dto.daycareAndSchoolInfo().wasInDaycare());
    anamnesis.setInDaycareSince(dto.daycareAndSchoolInfo().inDaycareSince());
    anamnesis.setDaycareName(dto.daycareAndSchoolInfo().daycareName());
    anamnesis.setSchoolName(dto.daycareAndSchoolInfo().schoolName());
    anamnesis.setResponsiblePhysician(dto.additionalChildInfo().responsiblePhysician());
    anamnesis.setNumberOfSiblings(dto.additionalChildInfo().numberOfSiblings());
    anamnesis.setSiblingsBirthYears(dto.additionalChildInfo().siblingsBirthYears());
    anamnesis.setSpectaclesInFamily(dto.familyHistoryInfo().spectaclesInFamily());
    anamnesis.setChronicIllnessOrDisabilityInFamily(
        dto.familyHistoryInfo().chronicIllnessOrDisabilityInFamily());
    anamnesis.setSevereIllnesses(dto.illnessAndAccidentInfo().severeIllnesses());
    anamnesis.setAllergies(dto.illnessAndAccidentInfo().allergies());
    anamnesis.setHospitalizationsOrOperations(
        dto.illnessAndAccidentInfo().hospitalizationsOrOperations());
    anamnesis.setUnderMedicalTreatmentFor(dto.illnessAndAccidentInfo().underMedicalTreatmentFor());
    anamnesis.setRegularMedication(dto.illnessAndAccidentInfo().regularMedication());
    anamnesis.setClubSport(dto.interestsAndSportsInfo().clubSport());
    anamnesis.setOtherInterests(dto.interestsAndSportsInfo().otherInterests());
    anamnesis.setCanSwim(dto.interestsAndSportsInfo().canSwim());
    anamnesis.setHasSeahorseBadge(dto.interestsAndSportsInfo().hasSeahorseBadge());
    anamnesis.setMediaConsumption(mapToDomain(dto.interestsAndSportsInfo().mediaConsumption()));
    anamnesis.setU2(mapToDomain(dto.checkUps().u2()));
    anamnesis.setU3(mapToDomain(dto.checkUps().u3()));
    anamnesis.setU4(mapToDomain(dto.checkUps().u4()));
    anamnesis.setU5(mapToDomain(dto.checkUps().u5()));
    anamnesis.setU6(mapToDomain(dto.checkUps().u6()));
    anamnesis.setU7(mapToDomain(dto.checkUps().u7()));
    anamnesis.setU7a(mapToDomain(dto.checkUps().u7a()));
    anamnesis.setU8(mapToDomain(dto.checkUps().u8()));
    anamnesis.setU9(mapToDomain(dto.checkUps().u9()));
    anamnesis.setEarlySupport(dto.promotionBeforeSchoolEntry().earlySupport());
    anamnesis.setIntegrationPlace(dto.promotionBeforeSchoolEntry().integrationPlace());
    anamnesis.setErgotherapy(dto.promotionBeforeSchoolEntry().ergotherapy());
    anamnesis.setSpeechTherapy(dto.promotionBeforeSchoolEntry().speechTherapy());
    anamnesis.setPhysiotherapy(dto.promotionBeforeSchoolEntry().physiotherapy());
    anamnesis.setVisionImpairment(dto.promotionTherapyAndAidInfo().visionImpairment());
    anamnesis.setHearingImpairment(dto.promotionTherapyAndAidInfo().hearingImpairment());
    anamnesis.setSpeechImpairment(dto.promotionTherapyAndAidInfo().speechImpairment());
    anamnesis.setSpectaclesSince(dto.promotionTherapyAndAidInfo().spectaclesSince());
    anamnesis.setVisionSchoolSince(dto.promotionTherapyAndAidInfo().visionSchoolSince());
    anamnesis.setHearingAid(dto.promotionTherapyAndAidInfo().hearingAid());
    anamnesis.setSpeechTherapyStart(dto.promotionTherapyAndAidInfo().speechTherapyStart());
    anamnesis.setSpeechTherapyEnd(dto.promotionTherapyAndAidInfo().speechTherapyEnd());
    anamnesis.setErgoTherapyStart(dto.promotionTherapyAndAidInfo().ergoTherapyStart());
    anamnesis.setErgoTherapyEnd(dto.promotionTherapyAndAidInfo().ergoTherapyEnd());
    anamnesis.setPhysioTherapyStart(dto.promotionTherapyAndAidInfo().physioTherapyStart());
    anamnesis.setPhysioTherapyEnd(dto.promotionTherapyAndAidInfo().physioTherapyEnd());
    anamnesis.setAdditionalTherapies(dto.promotionTherapyAndAidInfo().additionalTherapies());
    anamnesis.setNationalityChild(mapToDomain(dto.migrationBackground().nationalityChild()));
    anamnesis.setCountryOfBirthChild(mapToDomain(dto.migrationBackground().countryOfBirthChild()));
    anamnesis.setNationalityFirstParent(
        mapToDomain(dto.migrationBackground().nationalityFirstParent()));
    anamnesis.setCountryOfBirthFirstParent(
        mapToDomain(dto.migrationBackground().countryOfBirthFirstParent()));
    anamnesis.setNationalitySecondParent(
        mapToDomain(dto.migrationBackground().nationalitySecondParent()));
    anamnesis.setCountryOfBirthSecondParent(
        mapToDomain(dto.migrationBackground().countryOfBirthSecondParent()));
    anamnesis.setHasMigrationBackground(dto.migrationBackground().hasMigrationBackground());
    anamnesis.setInGermanySince(dto.migrationBackground().inGermanySince());
    anamnesis.setPersonalConspicuities(dto.personalConspicuities());
    anamnesis.setNote(dto.note());

    return anamnesis;
  }

  private static BooleanWithUnknown mapToDomain(BooleanWithUnknownDto value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknown.TRUE;
      case FALSE -> BooleanWithUnknown.FALSE;
      case UNKNOWN -> BooleanWithUnknown.UNKNOWN;
    };
  }

  public static Anamnesis mapCitizenAnamnesisToDomain(CitizenAnamnesisDto citizenAnamnesisDto) {
    Anamnesis anamnesis = new Anamnesis();
    anamnesis.setNationalityChild(
        mapToDomain(citizenAnamnesisDto.migrationBackground().nationalityChild()));
    anamnesis.setCountryOfBirthChild(
        mapToDomain(citizenAnamnesisDto.migrationBackground().countryOfBirthChild()));
    anamnesis.setNationalityFirstParent(
        mapToDomain(citizenAnamnesisDto.migrationBackground().nationalityFirstParent()));
    anamnesis.setCountryOfBirthFirstParent(
        mapToDomain(citizenAnamnesisDto.migrationBackground().countryOfBirthFirstParent()));
    anamnesis.setNationalitySecondParent(
        mapToDomain(citizenAnamnesisDto.migrationBackground().nationalitySecondParent()));
    anamnesis.setCountryOfBirthSecondParent(
        mapToDomain(citizenAnamnesisDto.migrationBackground().countryOfBirthSecondParent()));
    anamnesis.setHasMigrationBackground(
        getMigrationBackground(citizenAnamnesisDto.migrationBackground()));
    anamnesis.setInGermanySince(citizenAnamnesisDto.migrationBackground().inGermanySince());
    anamnesis.setPreliminaryCourse(citizenAnamnesisDto.preliminaryCourse());
    anamnesis.setChildLanguageScreening(citizenAnamnesisDto.childLanguageScreening());
    anamnesis.setLanguageScreeningConsent(citizenAnamnesisDto.languageScreeningConsent());
    anamnesis.setEarlySupport(citizenAnamnesisDto.promotionBeforeSchoolEntry().earlySupport());
    anamnesis.setIntegrationPlace(
        citizenAnamnesisDto.promotionBeforeSchoolEntry().integrationPlace());
    anamnesis.setErgotherapy(citizenAnamnesisDto.promotionBeforeSchoolEntry().ergotherapy());
    anamnesis.setSpeechTherapy(citizenAnamnesisDto.promotionBeforeSchoolEntry().speechTherapy());
    anamnesis.setPhysiotherapy(citizenAnamnesisDto.promotionBeforeSchoolEntry().physiotherapy());

    anamnesis.setResponsiblePhysician(
        citizenAnamnesisDto.additionalChildInfo().responsiblePhysician());
    anamnesis.setNumberOfSiblings(
        citizenAnamnesisDto.additionalChildInfo().siblingsBirthYears() == null
                || citizenAnamnesisDto.additionalChildInfo().siblingsBirthYears().isEmpty()
            ? null
            : citizenAnamnesisDto.additionalChildInfo().siblingsBirthYears().size());
    anamnesis.setSiblingsBirthYears(
        citizenAnamnesisDto.additionalChildInfo().siblingsBirthYears() == null
            ? null
            : citizenAnamnesisDto.additionalChildInfo().siblingsBirthYears());

    anamnesis.setWasInDaycare(citizenAnamnesisDto.daycareAndSchoolInfo().wasInDaycare());
    anamnesis.setInDaycareSince(citizenAnamnesisDto.daycareAndSchoolInfo().inDaycareSince());
    anamnesis.setDaycareName(citizenAnamnesisDto.daycareAndSchoolInfo().daycareName());
    anamnesis.setSchoolName(citizenAnamnesisDto.daycareAndSchoolInfo().schoolName());

    anamnesis.setSpectaclesInFamily(citizenAnamnesisDto.familyHistoryInfo().spectaclesInFamily());
    anamnesis.setChronicIllnessOrDisabilityInFamily(
        citizenAnamnesisDto.familyHistoryInfo().chronicIllnessOrDisabilityInFamily());

    anamnesis.setDevelopmentConspicuities(
        citizenAnamnesisDto.developmentInfo().developmentConspicuities());
    anamnesis.setInfancyConspicuities(citizenAnamnesisDto.developmentInfo().infancyConspicuities());
    anamnesis.setGestationalAge(citizenAnamnesisDto.developmentInfo().gestationalAge());
    anamnesis.setBirthWeight(citizenAnamnesisDto.developmentInfo().birthWeight());
    anamnesis.setDailyTeethBrushing(citizenAnamnesisDto.developmentInfo().dailyTeethBrushing());
    anamnesis.setTeethBrushingAfterCare(
        citizenAnamnesisDto.developmentInfo().teethBrushingAfterCare());
    anamnesis.setElectricToothBrush(citizenAnamnesisDto.developmentInfo().electricToothBrush());
    anamnesis.setFluorideToothPaste(citizenAnamnesisDto.developmentInfo().fluorideToothPaste());

    anamnesis.setSevereIllnesses(citizenAnamnesisDto.illnessAndAccidentInfo().severeIllnesses());
    anamnesis.setAllergies(
        citizenAnamnesisDto.illnessAndAccidentInfo().allergies().isEmpty()
            ? null
            : citizenAnamnesisDto.illnessAndAccidentInfo().allergies());
    anamnesis.setHospitalizationsOrOperations(
        citizenAnamnesisDto.illnessAndAccidentInfo().hospitalizationsOrOperations());
    anamnesis.setUnderMedicalTreatmentFor(
        citizenAnamnesisDto.illnessAndAccidentInfo().underMedicalTreatmentFor());
    anamnesis.setRegularMedication(
        citizenAnamnesisDto.illnessAndAccidentInfo().regularMedication());

    anamnesis.setVisionImpairment(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().visionImpairment());
    anamnesis.setHearingImpairment(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().hearingImpairment());
    anamnesis.setSpeechImpairment(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().speechImpairment());
    anamnesis.setSpectaclesSince(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().spectaclesSince());
    anamnesis.setVisionSchoolSince(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().visionSchoolSince());
    anamnesis.setHearingAid(citizenAnamnesisDto.promotionTherapyAndAidInfo().hearingAid());
    anamnesis.setSpeechTherapyStart(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().speechTherapyStart());
    anamnesis.setSpeechTherapyEnd(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().speechTherapyEnd());
    anamnesis.setErgoTherapyStart(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().ergoTherapyStart());
    anamnesis.setErgoTherapyEnd(citizenAnamnesisDto.promotionTherapyAndAidInfo().ergoTherapyEnd());
    anamnesis.setPhysioTherapyStart(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().physioTherapyStart());
    anamnesis.setPhysioTherapyEnd(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().physioTherapyEnd());
    anamnesis.setAdditionalTherapies(
        citizenAnamnesisDto.promotionTherapyAndAidInfo().additionalTherapies());

    anamnesis.setClubSport(citizenAnamnesisDto.interestsAndSportsInfo().clubSport());
    anamnesis.setOtherInterests(citizenAnamnesisDto.interestsAndSportsInfo().otherInterests());
    anamnesis.setCanSwim(citizenAnamnesisDto.interestsAndSportsInfo().canSwim());
    anamnesis.setHasSeahorseBadge(citizenAnamnesisDto.interestsAndSportsInfo().hasSeahorseBadge());
    anamnesis.setMediaConsumption(
        mapToDomain(citizenAnamnesisDto.interestsAndSportsInfo().mediaConsumption()));

    anamnesis.setPersonalConspicuities(citizenAnamnesisDto.personalConspicuities());
    return anamnesis;
  }

  private static @Nullable Boolean getMigrationBackground(
      CitizenMigrationBackgroundDto migrationBackground) {
    if (migrationBackground.nationalityChild() == null
        && migrationBackground.nationalityFirstParent() == null
        && migrationBackground.nationalitySecondParent() == null) {
      return null;
    }

    return migrationBackground.nationalityChild() != CountryCodeDto.DEU
        || migrationBackground.nationalityFirstParent() != CountryCodeDto.DEU
        || migrationBackground.nationalitySecondParent() != CountryCodeDto.DEU;
  }

  public static SchoolEntryCountryCode mapToDomain(CountryCodeDto dto) {
    if (dto == null) {
      return null;
    }
    return SchoolEntryCountryCode.valueOf(dto.name());
  }

  private static MediaConsumption mapToDomain(MediaConsumptionDto dto) {
    if (dto == null) {
      return null;
    }
    return switch (dto) {
      case LITTLE -> MediaConsumption.LITTLE;
      case MEDIUM -> MediaConsumption.MEDIUM;
      case MUCH -> MediaConsumption.MUCH;
    };
  }
}
