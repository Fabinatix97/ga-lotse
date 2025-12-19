/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.citizenpublic;

import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.officialmedicalservice.appointment.OmsAppointmentService;
import de.eshg.officialmedicalservice.concern.ConcernMapper;
import de.eshg.officialmedicalservice.config.OmsConfigService;
import de.eshg.officialmedicalservice.document.OmsDocumentService;
import de.eshg.officialmedicalservice.notification.NotificationService;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.OmsProcedureOverviewMapper;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.api.PostCitizenProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.i18n.LanguageContextHolder;
import java.util.List;
import java.util.UUID;
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
  private final OmsConfigService omsConfigService;

  public CitizenPublicProcedureService(
      OmsAppointmentService appointmentService,
      PersonClient personClient,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper,
      OmsProcedureRepository omsProcedureRepository,
      OmsDocumentService omsDocumentService,
      NotificationService notificationService,
      ProgressEntryService progressEntryService,
      OmsConfigService omsConfigService) {
    this.omsAppointmentService = appointmentService;
    this.personClient = personClient;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsDocumentService = omsDocumentService;
    this.notificationService = notificationService;
    this.progressEntryService = progressEntryService;
    this.omsConfigService = omsConfigService;
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

  @Transactional
  public byte[] getLandingPageContent() {
    MultiLangDocument landingContent = omsConfigService.getConfig().getLandingContent();
    return getDocumentContent(landingContent);
  }

  @Transactional
  public byte[] getSelectConcernInfobox() {
    MultiLangDocument selectedConcernInfobox =
        omsConfigService.getConfig().getSelectConcernInfobox();
    if (selectedConcernInfobox == null) {
      return null;
    }
    return getDocumentContent(selectedConcernInfobox);
  }

  private static byte[] getDocumentContent(MultiLangDocument document) {
    Language language = LanguageContextHolder.getLanguage();
    Document langDocument =
        switch (language) {
          case ENGLISH -> document.getEn();
          case GERMAN -> document.getDe();
        };
    if (langDocument != null) {
      return langDocument.getContent();
    } else {
      return document.getDe().getContent();
    }
  }
}
