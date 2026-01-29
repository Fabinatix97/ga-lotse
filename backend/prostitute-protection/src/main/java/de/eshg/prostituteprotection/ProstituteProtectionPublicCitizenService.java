/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import static de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper.mapConsultationType;
import static de.eshg.prostituteprotection.mapper.ProstituteProtectionMapper.mapLanguages;

import de.eshg.config.domain.Document;
import de.eshg.config.domain.MultiLangDocument;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.prostituteprotection.api.citizen.CreateCitizenProcedureRequest;
import de.eshg.prostituteprotection.domain.model.PersonalData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionConfig;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionTask;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.rest.service.i18n.Language;
import de.eshg.rest.service.i18n.LanguageContextHolder;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionPublicCitizenService {

  private final ProstituteProtectionService prostituteProtectionService;
  private final ProstituteProtectionAppointmentService appointmentService;
  private final ProstituteProtectionProcedureRepository procedureRepository;
  private final ProstituteProtectionConfigService configService;

  public ProstituteProtectionPublicCitizenService(
      ProstituteProtectionService prostituteProtectionService,
      ProstituteProtectionAppointmentService appointmentService,
      ProstituteProtectionProcedureRepository procedureRepository,
      ProstituteProtectionConfigService configService) {
    this.prostituteProtectionService = prostituteProtectionService;
    this.appointmentService = appointmentService;
    this.procedureRepository = procedureRepository;
    this.configService = configService;
  }

  public UUID createCitizenProcedure(CreateCitizenProcedureRequest request) {
    ProstituteProtectionProcedure procedure =
        new ProstituteProtectionProcedure(
            BasicSystemProgressEntryType.CREATED, TriggerType.CITIZEN);
    procedure.setConsultationType(mapConsultationType(request.consultationType()));
    prostituteProtectionService.initialiseProcedure(procedure);

    ProstituteProtectionTask task = new ProstituteProtectionTask();
    task.setTaskType(TaskType.PROSTITUTE_PROTECTION);
    task.setTaskStatus(TaskStatus.OPEN);
    procedure.addTask(task);

    PersonalData personalData = new PersonalData();
    personalData.setAlias(request.alias());
    personalData.setLanguages(mapLanguages(request.languages()));
    procedure.setPersonalData(personalData);

    appointmentService.bookAppointmentFromAppointmentBlock(
        procedure,
        AppointmentType.PROSTITUTE_PROTECTION_CONSULTATION,
        request.appointment().start(),
        request.appointment().end());
    procedureRepository.save(procedure);
    return procedure.getExternalId();
  }

  byte[] getLandingPageContent() {
    ProstituteProtectionConfig config = configService.getConfig();

    MultiLangDocument landingContent = config.getLandingContent();
    return getDocumentContent(landingContent);
  }

  boolean getOnlinePortalBookingEnabled() {
    return configService.getConfig().isOnlinePortalBookingEnabled();
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
