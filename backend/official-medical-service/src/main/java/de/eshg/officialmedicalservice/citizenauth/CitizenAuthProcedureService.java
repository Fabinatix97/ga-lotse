/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.citizenauth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.AffectedPersonInfoDto.FillingPersonDto;
import de.eshg.officialmedicalservice.anamnesis.api.PostAnamnesisRequest;
import de.eshg.officialmedicalservice.anamnesis.persistence.entity.OmsAnamnesis;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.citizenauth.api.GetCitizenProcedureDetailsResponse;
import de.eshg.officialmedicalservice.config.OmsConfigService;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CitizenAuthProcedureService {

  private final OmsProcedureRepository omsProcedureRepository;
  private final PersonClient personClient;
  private final CitizenProcedureMapper citizenProcedureMapper;
  private final OmsAppointmentService omsAppointmentService;
  private final OmsDocumentService omsDocumentService;
  private final ObjectMapper objectMapper;
  private final ProgressEntryService progressEntryService;
  private final OmsConfigService omsConfigService;

  public CitizenAuthProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      PersonClient personClient,
      CitizenProcedureMapper citizenProcedureMapper,
      OmsAppointmentService omsAppointmentService,
      OmsDocumentService omsDocumentService,
      ObjectMapper objectMapper,
      ProgressEntryService progressEntryService,
      OmsConfigService omsConfigService) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.personClient = personClient;
    this.citizenProcedureMapper = citizenProcedureMapper;
    this.omsAppointmentService = omsAppointmentService;
    this.omsDocumentService = omsDocumentService;
    this.objectMapper = objectMapper;
    this.progressEntryService = progressEntryService;
    this.omsConfigService = omsConfigService;
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
        procedure,
        affectedPersonDto,
        citizenPortalDocuments,
        omsConfigService.getConfig().isCitizenPortalAnamnesisEnabled());
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

  @Transactional
  public void postDocumentByCitizen(
      UUID citizenUserId, UUID documentId, List<MultipartFile> files) {
    OmsProcedure procedure = getProcedureByCitizenUserId(citizenUserId);

    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }

    omsDocumentService.uploadFilesToDocumentCitizen(documentId, files);
  }

  @Transactional
  public void postAnamnesis(UUID citizenUserId, PostAnamnesisRequest request) {
    if (!omsConfigService.getConfig().isCitizenPortalAnamnesisEnabled()) {
      throw new BadRequestException("Anamnesis is not enabled for online-portal");
    }

    if (request.anamnesis().affectedPersonInfo().fillingPerson() == FillingPersonDto.EMPLOYEE) {
      throw new BadRequestException("Filling person cannot be employee");
    }

    OmsProcedure procedure = getProcedureByCitizenUserId(citizenUserId);

    if (procedure.getAnamnesis() != null) {
      throw new BadRequestException("Anamnesis was already posted");
    }

    try {
      OmsAnamnesis anamnesis = new OmsAnamnesis();
      anamnesis.setProcedure(procedure);
      anamnesis.setContent(
          objectMapper
              .writerWithDefaultPrettyPrinter()
              .writeValueAsString(request.anamnesis())
              .getBytes(StandardCharsets.UTF_8));

      procedure.setAnamnesis(anamnesis);

      progressEntryService.createProgressEntryForAnamnesisChangedByCitizen(procedure);
    } catch (JsonProcessingException e) {
      throw new BadRequestException("Anamnesis is malformed");
    }
  }
}
