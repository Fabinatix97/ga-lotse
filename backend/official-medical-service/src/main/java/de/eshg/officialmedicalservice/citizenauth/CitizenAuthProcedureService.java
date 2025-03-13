/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenauth;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.citizenauth.api.GetCitizenProcedureDetailsResponse;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitizenAuthProcedureService {

  private final OmsProcedureRepository omsProcedureRepository;
  private final PersonClient personClient;
  private final CitizenProcedureMapper citizenProcedureMapper;
  private final OmsAppointmentService omsAppointmentService;

  public CitizenAuthProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      PersonClient personClient,
      CitizenProcedureMapper citizenProcedureMapper,
      OmsAppointmentService omsAppointmentService) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.personClient = personClient;
    this.citizenProcedureMapper = citizenProcedureMapper;
    this.omsAppointmentService = omsAppointmentService;
  }

  @Transactional(readOnly = true)
  public GetCitizenProcedureDetailsResponse getProcedureDetails(UUID citizenUserId) {
    OmsProcedure procedure = getProcedureByCitizenUserId(citizenUserId);
    Person person = procedure.findAffectedPerson();
    GetPersonFileStateResponse personFileState =
        personClient.getPersonFileState(person.getCentralFileStateId());
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(personFileState, person.getVersion());
    List<OmsDocument> citizenPortalDocuments =
        procedure.getDocuments().stream().filter(OmsDocument::isUploadInCitizenPortal).toList();

    return citizenProcedureMapper.toInterfaceType(
        procedure, affectedPersonDto, citizenPortalDocuments);
  }

  private OmsProcedure getProcedureByCitizenUserId(UUID citizenUserId) {
    return omsProcedureRepository
        .getByCitizenUserId(citizenUserId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  @Transactional
  public void cancelAppointmentByCitizen(UUID citizenUserId, UUID appointmentId) {
    OmsProcedure procedure = getProcedureByCitizenUserId(citizenUserId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }

    omsAppointmentService.cancelAppointmentCitizen(appointmentId);
  }

  @Transactional
  public void putAppointmentByCitizen(
      UUID citizenUserId, UUID appointmentId, AppointmentDto appointmentDto) {
    OmsProcedure procedure = getProcedureByCitizenUserId(citizenUserId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }

    omsAppointmentService.bookAppointmentCitizen(appointmentId, appointmentDto);
  }
}
