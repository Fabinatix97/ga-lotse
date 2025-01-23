/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.ExaminationResultDto;
import de.eshg.dental.api.FluoridationExaminationResultDto;
import de.eshg.dental.api.OralHygieneStatusDto;
import de.eshg.dental.api.ScreeningExaminationResultDto;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ExaminationResult;
import de.eshg.dental.domain.model.FluoridationExaminationResult;
import de.eshg.dental.domain.model.OralHygieneStatus;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.model.ScreeningExaminationResult;

public final class ExaminationMapper {
  private ExaminationMapper() {}

  public static ExaminationDto mapToDto(Examination examination) {
    if (examination == null) {
      return null;
    }
    ProphylaxisSession prophylaxisSession = examination.getProphylaxisSession();
    return new ExaminationDto(
        examination.getExternalId(),
        examination.getVersion(),
        prophylaxisSession.getDateAndTime(),
        ProphylaxisSessionMapper.mapToDto(prophylaxisSession.getType()),
        examination.getNote(),
        mapToDto(examination.getResult()));
  }

  public static ExaminationResultDto mapToDto(ExaminationResult result) {
    return switch (result) {
      case null -> null;
      case FluoridationExaminationResult fluoridationExaminationResult ->
          new FluoridationExaminationResultDto(
              fluoridationExaminationResult.isFluorideVarnishApplied());
      case ScreeningExaminationResult screeningExaminationResult ->
          new ScreeningExaminationResultDto(
              screeningExaminationResult.isFluorideVarnishApplied(),
              mapToDto(screeningExaminationResult.getOralHygieneStatus()));
      default -> throw new IllegalArgumentException("Unexpected examination result: " + result);
    };
  }

  private static OralHygieneStatusDto mapToDto(OralHygieneStatus oralHygieneStatus) {
    return switch (oralHygieneStatus) {
      case null -> null;
      case EXCELLENT -> OralHygieneStatusDto.EXCELLENT;
      case GOOD -> OralHygieneStatusDto.GOOD;
      case POOR -> OralHygieneStatusDto.POOR;
    };
  }

  public static OralHygieneStatus mapToDomain(OralHygieneStatusDto oralHygieneStatus) {
    return switch (oralHygieneStatus) {
      case null -> null;
      case EXCELLENT -> OralHygieneStatus.EXCELLENT;
      case GOOD -> OralHygieneStatus.GOOD;
      case POOR -> OralHygieneStatus.POOR;
    };
  }
}
