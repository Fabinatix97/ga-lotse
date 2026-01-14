/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.citizenauth;

import de.eshg.officialmedicalservice.appointment.OmsAppointmentMapper;
import de.eshg.officialmedicalservice.appointment.api.OmsAppointmentDto;
import de.eshg.officialmedicalservice.appointment.persistence.entity.AppointmentState;
import de.eshg.officialmedicalservice.citizenauth.api.GetCitizenProcedureDetailsResponse;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.document.OmsDocumentMapper;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.MedicalOpinionStatusDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CitizenProcedureMapper {

  private final OmsAppointmentMapper omsAppointmentMapper;
  private final OmsDocumentMapper omsDocumentMapper;

  public CitizenProcedureMapper(
      OmsAppointmentMapper omsAppointmentMapper, OmsDocumentMapper omsDocumentMapper) {
    this.omsAppointmentMapper = omsAppointmentMapper;
    this.omsDocumentMapper = omsDocumentMapper;
  }

  public GetCitizenProcedureDetailsResponse toInterfaceType(
      OmsProcedure omsProcedure,
      AffectedPersonDto affectedPersonDto,
      List<OmsDocument> citizenPortalDocuments,
      boolean isAnamnesisEnabled) {
    OmsAppointmentDto appointment =
        omsProcedure.getAppointments().stream()
            .filter(app -> app.getAppointmentState().equals(AppointmentState.OPEN))
            .findFirst()
            .map(omsAppointmentMapper::toInterfaceType)
            .orElse(null);

    return new GetCitizenProcedureDetailsResponse(
        omsProcedure.getExternalId(),
        affectedPersonDto.firstName(),
        affectedPersonDto.lastName(),
        affectedPersonDto.dateOfBirth(),
        appointment,
        ConcernMapper.mapToConcernDto(omsProcedure.getConcern()),
        omsDocumentMapper.toInterfaceType(citizenPortalDocuments),
        MedicalOpinionStatusDto.valueOf(omsProcedure.getMedicalOpinionStatus().name()),
        omsProcedure.getAnamnesis() != null,
        isAnamnesisEnabled);
  }
}
