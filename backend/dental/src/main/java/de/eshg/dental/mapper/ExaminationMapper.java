/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;

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
        examination.getNote());
  }
}
