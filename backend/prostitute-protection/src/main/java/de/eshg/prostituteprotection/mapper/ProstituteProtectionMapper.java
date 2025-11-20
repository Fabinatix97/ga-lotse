/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.prostituteprotection.api.ConsultationTypeDto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.LanguageDto;
import de.eshg.prostituteprotection.api.ProstituteProtectionProcedureOverviewDto;
import de.eshg.prostituteprotection.domain.model.ConsultationType;
import de.eshg.prostituteprotection.domain.model.Language;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import java.util.List;
import java.util.Objects;

public class ProstituteProtectionMapper {

  private ProstituteProtectionMapper() {}

  public static ProstituteProtectionProcedure mapRequestToDomain(
      CreateProstituteProtectionProcedureRequest request) {
    ProstituteProtectionProcedure prostituteProtectionProcedure =
        new ProstituteProtectionProcedure();
    prostituteProtectionProcedure.setLastName(request.lastName());
    prostituteProtectionProcedure.setFirstName(request.firstName());
    prostituteProtectionProcedure.setDateOfBirth(request.dateOfBirth());
    prostituteProtectionProcedure.setAlias(request.alias());
    prostituteProtectionProcedure.setLanguages(mapLanguages(request.languages()));
    prostituteProtectionProcedure.setConsultationType(
        mapConsultationType(request.consultationType()));

    return prostituteProtectionProcedure;
  }

  private static ConsultationType mapConsultationType(ConsultationTypeDto consultationTypeDto) {
    return switch (consultationTypeDto) {
      case null -> null;
      case ConsultationTypeDto.INITIAL -> ConsultationType.INITIAL;
      case ConsultationTypeDto.FOLLOW_UP -> ConsultationType.FOLLOW_UP;
    };
  }

  private static List<Language> mapLanguages(List<LanguageDto> languageDtos) {
    return languageDtos.stream()
        .map(ProstituteProtectionMapper::mapLanguage)
        .filter(Objects::nonNull)
        .toList();
  }

  private static Language mapLanguage(LanguageDto languageDto) {
    return switch (languageDto) {
      case null -> null;
      case LanguageDto.BULGARIAN -> Language.BULGARIAN;
      case LanguageDto.CHINESE -> Language.CHINESE;
      case LanguageDto.GERMAN -> Language.GERMAN;
      case LanguageDto.ENGLISH -> Language.ENGLISH;
      case LanguageDto.FRENCH -> Language.FRENCH;
      case LanguageDto.GREEK -> Language.GREEK;
      case LanguageDto.ITALIAN -> Language.ITALIAN;
      case LanguageDto.POLISH -> Language.POLISH;
      case LanguageDto.PORTUGUESE -> Language.PORTUGUESE;
      case LanguageDto.ROMANIAN -> Language.ROMANIAN;
      case LanguageDto.RUSSIAN -> Language.RUSSIAN;
      case LanguageDto.SERBO_CROATIAN -> Language.SERBO_CROATIAN;
      case LanguageDto.SLOVAKIAN -> Language.SLOVAKIAN;
      case LanguageDto.SPANISH -> Language.SPANISH;
      case LanguageDto.THAI -> Language.THAI;
      case LanguageDto.CZECH -> Language.CZECH;
      case LanguageDto.TURKISH -> Language.TURKISH;
      case LanguageDto.UKRAINIAN -> Language.UKRAINIAN;
      case LanguageDto.HUNGARIAN -> Language.HUNGARIAN;
      case LanguageDto.UNKNOWN -> Language.UNKNOWN;
    };
  }

  public static ProstituteProtectionProcedureOverviewDto mapProcedureToOverviewDto(
      ProstituteProtectionProcedure procedure) {
    return new ProstituteProtectionProcedureOverviewDto(
        procedure.getExternalId(),
        procedure.getFirstName(),
        procedure.getLastName(),
        procedure.getAlias(),
        procedure.getDateOfBirth(),
        mapLanguagesToInterfaceType(procedure),
        mapConsultationTypeToInterfaceType(procedure.getConsultationType()),
        procedure.getAppointment() == null
            ? null
            : procedure.getAppointment().getAppointmentStart(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        procedure.getCreatedAt(),
        procedure.getModifiedAt());
  }

  private static List<LanguageDto> mapLanguagesToInterfaceType(
      ProstituteProtectionProcedure procedure) {
    return procedure.getLanguages().stream()
        .map(ProstituteProtectionMapper::mapLanguageToInterfaceType)
        .toList();
  }

  private static LanguageDto mapLanguageToInterfaceType(Language language) {
    return switch (language) {
      case Language.BULGARIAN -> LanguageDto.BULGARIAN;
      case Language.CHINESE -> LanguageDto.CHINESE;
      case Language.GERMAN -> LanguageDto.GERMAN;
      case Language.ENGLISH -> LanguageDto.ENGLISH;
      case Language.FRENCH -> LanguageDto.FRENCH;
      case Language.GREEK -> LanguageDto.GREEK;
      case Language.ITALIAN -> LanguageDto.ITALIAN;
      case Language.POLISH -> LanguageDto.POLISH;
      case Language.PORTUGUESE -> LanguageDto.PORTUGUESE;
      case Language.ROMANIAN -> LanguageDto.ROMANIAN;
      case Language.RUSSIAN -> LanguageDto.RUSSIAN;
      case Language.SERBO_CROATIAN -> LanguageDto.SERBO_CROATIAN;
      case Language.SLOVAKIAN -> LanguageDto.SLOVAKIAN;
      case Language.SPANISH -> LanguageDto.SPANISH;
      case Language.THAI -> LanguageDto.THAI;
      case Language.CZECH -> LanguageDto.CZECH;
      case Language.TURKISH -> LanguageDto.TURKISH;
      case Language.UKRAINIAN -> LanguageDto.UKRAINIAN;
      case Language.HUNGARIAN -> LanguageDto.HUNGARIAN;
      case Language.UNKNOWN -> LanguageDto.UNKNOWN;
    };
  }

  private static ConsultationTypeDto mapConsultationTypeToInterfaceType(
      ConsultationType consultationType) {
    return switch (consultationType) {
      case null -> null;
      case ConsultationType.INITIAL -> ConsultationTypeDto.INITIAL;
      case ConsultationType.FOLLOW_UP -> ConsultationTypeDto.FOLLOW_UP;
    };
  }
}
