/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.medicalhistory.api.MedicalHistoryDto;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import de.eshg.travelmedicine.vaccinationconsultation.ProcedureStepService;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import java.time.Instant;

public class MedicalHistoryMapper {
  private MedicalHistoryMapper() {}

  public static MedicalHistoryDto toInterfaceType(MedicalHistory medicalHistory, ProcedureStep ps) {
    ObjectMapper objectMapper = new ObjectMapper();
    DocumentContentDto medicalHistoryContent;
    try {
      medicalHistoryContent =
          objectMapper.readValue(medicalHistory.getContent(), DocumentContentDto.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Content does not match required structure");
    }
    return new MedicalHistoryDto(
        medicalHistory.getId(),
        ps.getId(),
        getAppointment(ps),
        ps.getIsFollowUp(),
        medicalHistoryContent,
        medicalHistory.isCompletelyAnswered(),
        medicalHistory.isCitizenHasAnswered(),
        medicalHistory.getNote(),
        medicalHistory.getCreatedAt(),
        medicalHistory.getModifiedAt());
  }

  private static Instant getAppointment(ProcedureStep ps) {
    return ProcedureStepService.getStartDateOrEarliestDateFromAppointment(ps);
  }

  public static DocumentContentDto contentToInterfaceType(MedicalHistory medicalHistory) {
    ObjectMapper objectMapper = new ObjectMapper();
    DocumentContentDto medicalHistoryContent;
    try {
      medicalHistoryContent =
          objectMapper.readValue(medicalHistory.getContent(), DocumentContentDto.class);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Content does not match required structure");
    }
    return medicalHistoryContent;
  }
}
