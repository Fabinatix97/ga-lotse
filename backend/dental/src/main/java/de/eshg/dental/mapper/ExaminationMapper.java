/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.domain.model.Examination;

public final class ExaminationMapper {
  private ExaminationMapper() {}

  public static ExaminationDto mapToDto(Examination examination) {
    if (examination == null) {
      return null;
    }
    return new ExaminationDto(
        examination.getExternalId(),
        examination.getVersion(),
        examination.getProphylaxisSession().getDateAndTime(),
        examination.getNote());
  }
}
