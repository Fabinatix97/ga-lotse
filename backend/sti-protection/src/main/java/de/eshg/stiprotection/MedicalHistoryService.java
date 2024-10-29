/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import static de.eshg.stiprotection.StiProtectionProcedureService.unexpectedProcedureStatus;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.api.medicalhistory.CreateMedicalHistoryRequest;
import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkMedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.StiConsultationMedicalHistoryDto;
import de.eshg.stiprotection.mapper.medicalhistory.MedicalHistoryMapper;
import de.eshg.stiprotection.persistence.db.Concern;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MedicalHistoryService {

  private final StiProtectionProcedureService stiProtectionProcedureService;

  public MedicalHistoryService(StiProtectionProcedureService stiProtectionProcedureService) {
    this.stiProtectionProcedureService = stiProtectionProcedureService;
  }

  @Transactional
  public MedicalHistoryDto createMedicalHistory(
      UUID procedureId, CreateMedicalHistoryRequest request) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);

    ProcedureStatus procedureStatus = procedure.getProcedureStatus();
    if (!procedureStatus.isOpen()) {
      throw unexpectedProcedureStatus(procedureId, procedureStatus);
    }

    MedicalHistoryDto medicalHistoryDto = request.medicalHistory();
    if (medicalHistoryDto instanceof StiConsultationMedicalHistoryDto
        && procedure.getConcern() != Concern.HIV_STI_CONSULTATION) {
      throw new BadRequestException(
          "StiConsultationMedicalHistory can't be created at procedure %s with concern %s"
              .formatted(procedureId, procedure.getConcern()));
    } else if (medicalHistoryDto instanceof SexWorkMedicalHistoryDto
        && procedure.getConcern() != Concern.SEX_WORK) {
      throw new BadRequestException(
          "SexWorkMedicalHistory can't be created at procedure %s with concern %s"
              .formatted(procedureId, procedure.getConcern()));
    }

    MedicalHistory medicalHistory = MedicalHistoryMapper.toDatabaseType(medicalHistoryDto);
    procedure.setMedicalHistory(medicalHistory);

    return MedicalHistoryMapper.toInterfaceType(medicalHistory);
  }

  @Transactional
  public MedicalHistoryDto getMedicalHistory(UUID procedureId) {
    StiProtectionProcedure procedure =
        stiProtectionProcedureService.findProcedureByExternalId(procedureId);
    MedicalHistory medicalHistory = procedure.getMedicalHistory();

    if (medicalHistory == null) {
      throw new NotFoundException(
          "MedicalHistory of procedure with UUID %s not found".formatted(procedureId));
    }

    return MedicalHistoryMapper.toInterfaceType(medicalHistory);
  }
}
