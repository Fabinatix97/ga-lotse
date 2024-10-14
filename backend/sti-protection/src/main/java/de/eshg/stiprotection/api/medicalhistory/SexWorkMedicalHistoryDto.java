/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

@Schema(name = SexWorkMedicalHistoryDto.SCHEMA_NAME)
public record SexWorkMedicalHistoryDto(
    String examinationReason,
    SexualOrientationDto sexualOrientation,
    GenderDto sexualContact,
    @Valid List<ExaminationDto> examinations,
    @Valid List<VaccinationDto> vaccinations)
    implements MedicalHistoryDto {

  static final String SCHEMA_NAME = "SexWorkMedicalHistory";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
