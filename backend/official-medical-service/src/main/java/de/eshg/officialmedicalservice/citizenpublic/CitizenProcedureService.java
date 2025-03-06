/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
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
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CitizenProcedureService {
  private final OmsAppointmentService omsAppointmentService;
  private final PersonClient personClient;
  private final OmsProcedureOverviewMapper omsProcedureOverviewMapper;
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsDocumentService omsDocumentService;
  private final NotificationService notificationService;
  private final ProgressEntryService progressEntryService;

  public CitizenProcedureService(
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

    notificationService.notifyNewCitizenProcedure(request.affectedPerson());

    progressEntryService.createProgressEntryForConcernChanged(
        procedure, request.concern().nameDe());

    return procedure.getExternalId();
  }
}
