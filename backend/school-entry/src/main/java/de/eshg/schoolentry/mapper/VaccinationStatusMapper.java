/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.vaccination.MeaslesVaccinationDto;
import de.eshg.schoolentry.domain.model.BooleanWithUnknown;
import de.eshg.schoolentry.domain.model.OtherVaccination;
import de.eshg.schoolentry.domain.model.VaccinationSchemeValue;
import de.eshg.schoolentry.domain.model.VaccinationStatus;
import java.util.List;

public final class VaccinationStatusMapper {

  private VaccinationStatusMapper() {}

  public static VaccinationStatusDto mapToDto(VaccinationStatus vaccinationStatus) {
    if (vaccinationStatus == null) {
      return null;
    }

    return new VaccinationStatusDto(
        vaccinationStatus.getVersion(),
        mapToDto(vaccinationStatus.getVaccinationScheme()),
        vaccinationStatus.getDiphtheria(),
        vaccinationStatus.getTetanus(),
        vaccinationStatus.getPertussis(),
        vaccinationStatus.getHib(),
        vaccinationStatus.getPolio(),
        vaccinationStatus.getHepatitisB(),
        vaccinationStatus.getPneumococcus(),
        vaccinationStatus.getMmr(),
        vaccinationStatus.getVaricella(),
        vaccinationStatus.getMeningococcusB(),
        vaccinationStatus.getMeningococcusC(),
        vaccinationStatus.getRota(),
        vaccinationStatus.getTbe(),
        vaccinationStatus.getHepatitisA(),
        mapToDto(vaccinationStatus.getOtherVaccinations()),
        vaccinationStatus.getVaccinationPassPresented(),
        mapToDto(vaccinationStatus.getPerkombiHbv()),
        vaccinationStatus.getMeaslesContraIndication(),
        vaccinationStatus.getMeaslesContraIndicationIsPermanent(),
        vaccinationStatus.getMeaslesContraIndicationUntil(),
        vaccinationStatus.getNote());
  }

  public static MeaslesVaccinationDto mapToMeaslesVaccinationStatusDto(
      VaccinationStatus vaccinationStatus) {
    return new MeaslesVaccinationDto(
        vaccinationStatus.getMmr(),
        vaccinationStatus.getVaccinationPassPresented(),
        vaccinationStatus.getMeaslesContraIndication(),
        vaccinationStatus.getMeaslesContraIndicationIsPermanent(),
        vaccinationStatus.getMeaslesContraIndicationUntil());
  }

  private static List<OtherVaccinationDto> mapToDto(List<OtherVaccination> otherVaccinations) {
    if (otherVaccinations == null || otherVaccinations.isEmpty()) {
      return List.of();
    }

    return otherVaccinations.stream()
        .map(v -> new OtherVaccinationDto(v.description(), v.count()))
        .toList();
  }

  public static VaccinationStatus mapToDomain(VaccinationStatusDto dto) {
    if (dto == null) {
      return null;
    }

    VaccinationStatus vaccinationStatus = new VaccinationStatus();
    vaccinationStatus.setVaccinationScheme(mapToDomain(dto.vaccinationScheme()));
    vaccinationStatus.setDiphtheria(dto.diphtheria());
    vaccinationStatus.setTetanus(dto.tetanus());
    vaccinationStatus.setPertussis(dto.pertussis());
    vaccinationStatus.setHib(dto.hib());
    vaccinationStatus.setPolio(dto.polio());
    vaccinationStatus.setHepatitisB(dto.hepatitisB());
    vaccinationStatus.setPneumococcus(dto.pneumococcus());
    vaccinationStatus.setMmr(dto.mmr());
    vaccinationStatus.setVaricella(dto.varicella());
    vaccinationStatus.setMeningococcusB(dto.meningococcusB());
    vaccinationStatus.setMeningococcusC(dto.meningococcusC());
    vaccinationStatus.setRota(dto.rota());
    vaccinationStatus.setTbe(dto.tbe());
    vaccinationStatus.setHepatitisA(dto.hepatitisA());
    vaccinationStatus.setOtherVaccinations(mapToDomain(dto.otherVaccinations()));
    vaccinationStatus.setVaccinationPassPresented(dto.vaccinationPassPresented());
    vaccinationStatus.setPerkombiHbv(mapToDomain(dto.perkombiHbv()));
    vaccinationStatus.setMeaslesContraIndication(dto.measlesContraIndication());
    vaccinationStatus.setMeaslesContraIndicationIsPermanent(
        dto.measlesContraIndicationIsPermanent());
    vaccinationStatus.setMeaslesContraIndicationUntil(dto.measlesContraIndicationUntil());
    vaccinationStatus.setNote(dto.note());
    return vaccinationStatus;
  }

  private static List<OtherVaccination> mapToDomain(List<OtherVaccinationDto> dto) {
    if (dto == null || dto.isEmpty()) {
      return List.of();
    }

    return dto.stream().map(v -> new OtherVaccination(v.description(), v.count())).toList();
  }

  private static VaccinationSchemeValueDto mapToDto(VaccinationSchemeValue vaccinationScheme) {
    return switch (vaccinationScheme) {
      case null -> null;
      case SCHEME_2_PLUS_1 -> VaccinationSchemeValueDto.SCHEME_2_PLUS_1;
      case SCHEME_3_PLUS_1 -> VaccinationSchemeValueDto.SCHEME_3_PLUS_1;
      case UNKNOWN -> VaccinationSchemeValueDto.UNKNOWN;
    };
  }

  private static VaccinationSchemeValue mapToDomain(VaccinationSchemeValueDto vaccinationScheme) {
    return switch (vaccinationScheme) {
      case null -> null;
      case SCHEME_2_PLUS_1 -> VaccinationSchemeValue.SCHEME_2_PLUS_1;
      case SCHEME_3_PLUS_1 -> VaccinationSchemeValue.SCHEME_3_PLUS_1;
      case UNKNOWN -> VaccinationSchemeValue.UNKNOWN;
    };
  }

  private static BooleanWithUnknownDto mapToDto(BooleanWithUnknown value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknownDto.TRUE;
      case FALSE -> BooleanWithUnknownDto.FALSE;
      case UNKNOWN -> BooleanWithUnknownDto.UNKNOWN;
    };
  }

  private static BooleanWithUnknown mapToDomain(BooleanWithUnknownDto value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknown.TRUE;
      case FALSE -> BooleanWithUnknown.FALSE;
      case UNKNOWN -> BooleanWithUnknown.UNKNOWN;
    };
  }
}
