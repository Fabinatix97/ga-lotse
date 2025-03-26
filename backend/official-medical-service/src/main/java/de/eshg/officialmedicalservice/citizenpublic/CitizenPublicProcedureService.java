/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.citizenpublic.api.LandingContentDto;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.notification.NotificationService;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.OmsProcedureOverviewMapper;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.api.PostCitizenProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CitizenPublicProcedureService {
  private final OmsAppointmentService omsAppointmentService;
  private final PersonClient personClient;
  private final OmsProcedureOverviewMapper omsProcedureOverviewMapper;
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsDocumentService omsDocumentService;
  private final NotificationService notificationService;
  private final ProgressEntryService progressEntryService;

  @Value("${de.eshg.official-medical-service.landing.config}")
  private Resource landingResource;

  public CitizenPublicProcedureService(
      OmsAppointmentService appointmentService,
      PersonClient personClient,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper,
      OmsProcedureRepository omsProcedureRepository,
      OmsDocumentService omsDocumentService,
      NotificationService notificationService,
      ProgressEntryService progressEntryService) {
    this.omsAppointmentService = appointmentService;
    this.personClient = personClient;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsDocumentService = omsDocumentService;
    this.notificationService = notificationService;
    this.progressEntryService = progressEntryService;
  }

  @Transactional
  public UUID createCitizenProcedure(
      PostCitizenProcedureRequest request, List<MultipartFile> files) {
    AddPersonFileStateResponse affectedPersonBaseResponse =
        personClient.addPersonFromExternalSource(
            PersonMapper.mapToExternalAddPersonFileStateRequest(request.affectedPerson()));

    OmsProcedure procedure =
        omsProcedureOverviewMapper.toDomainType(null, affectedPersonBaseResponse, null);
    procedure.setSendEmailNotifications(true);

    omsProcedureRepository.save(procedure);

    omsAppointmentService.addAppointmentCitizen(procedure, request.appointment());

    procedure.setConcern(ConcernMapper.mapToEntity(request.concern()));

    omsDocumentService.addLetterOfAssignmentCitizen(procedure, files);
    omsDocumentService.addInitialReleaseFromConfidentiality(procedure);

    notificationService.notifyNewCitizenProcedure(request.affectedPerson());

    progressEntryService.createProgressEntryForBookingAppointmentByCitizen(
        procedure, request.appointment().bookingInfo().start(), TriggerType.SYSTEM_AUTOMATIC);

    progressEntryService.createProgressEntryForConcernChanged(
        procedure, request.concern().nameDe());

    return procedure.getExternalId();
  }

  public LandingContentDto getLandingContent() {
    try {
      InputStream inputStream = landingResource.getInputStream();

      ObjectMapper objectMapper = new ObjectMapper();

      return objectMapper.readValue(inputStream, LandingContentDto.class);
    } catch (IOException e) {
      throw new BadRequestException(
          ErrorCode.UNEXPECTED_ERROR,
          "Cannot read landing config file: " + landingResource.getFilename());
    }
  }
}
