/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.procedure.domain.model.InboxProgressEntryType;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryType;
import de.eshg.lib.procedure.domain.model.ProcessedInboxProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.model.CreateManualProgressEntryRequest;
import de.eshg.lib.procedure.model.InboxProgressEntryTypeDto;
import de.eshg.lib.procedure.model.ManualProgressEntryDto;
import de.eshg.lib.procedure.model.ManualProgressEntryHistoryDto;
import de.eshg.lib.procedure.model.ManualProgressEntryTypeDto;
import de.eshg.lib.procedure.model.ProcessedInboxProgressEntryDto;
import de.eshg.lib.procedure.model.ProgressEntryDto;
import de.eshg.lib.procedure.model.SystemProgressEntryDto;
import de.eshg.lib.procedure.model.TriggerTypeDto;
import de.eshg.mapper.RevisionEntry;

public class ProgressEntryMapper {

  private ProgressEntryMapper() {}

  public static ManualProgressEntryType toDomainType(
      ManualProgressEntryTypeDto manualProgressEntryTypeDto) {
    return switch (manualProgressEntryTypeDto) {
      case LETTER -> ManualProgressEntryType.LETTER;
      case PHONE_CALL -> ManualProgressEntryType.PHONE_CALL;
      case NOTE -> ManualProgressEntryType.NOTE;
      case EMAIL -> ManualProgressEntryType.EMAIL;
      case IMAGE -> ManualProgressEntryType.IMAGE;
      case DOCUMENT -> ManualProgressEntryType.DOCUMENT;
    };
  }

  public static TriggerType toDomainType(TriggerTypeDto triggerTypeDto) {
    return switch (triggerTypeDto) {
      case EMPLOYEE -> TriggerType.EMPLOYEE;
      case SYSTEM_AUTOMATIC -> TriggerType.SYSTEM_AUTOMATIC;
      case CITIZEN -> TriggerType.CITIZEN;
    };
  }

  public static ProgressEntryDto toInterfaceType(ProgressEntry progressEntry) {
    return switch (progressEntry) {
      case SystemProgressEntry systemProgressEntry -> toInterfaceType(systemProgressEntry);
      case ManualProgressEntry manualProgressEntry -> toInterfaceType(manualProgressEntry);
      case ProcessedInboxProgressEntry processedInboxProgressEntry ->
          toInterfaceType(processedInboxProgressEntry);
      default ->
          throw new IllegalArgumentException(
              "Unsupported progress entry subclass: %s"
                  .formatted(progressEntry.getClass().getSimpleName()));
    };
  }

  private static SystemProgressEntryDto toInterfaceType(SystemProgressEntry progressEntry) {
    SystemProgressEntryDto systemProgressEntryDto = new SystemProgressEntryDto();
    systemProgressEntryDto.setSystemProgressEntryType(progressEntry.getSystemProgressEntryType());
    systemProgressEntryDto.setTriggeredBy(progressEntry.getTriggeredBy());
    systemProgressEntryDto.setChangeDescription(progressEntry.getChangeDescription());
    systemProgressEntryDto.setTriggerType(toInterfaceType(progressEntry.getTriggerType()));
    fillGeneralProgressEntry(systemProgressEntryDto, progressEntry);
    return systemProgressEntryDto;
  }

  public static ManualProgressEntryDto toInterfaceType(ManualProgressEntry progressEntry) {
    ManualProgressEntryDto manualProgressEntryDto = new ManualProgressEntryDto();
    manualProgressEntryDto.setManualProgressEntryType(
        toInterfaceType(progressEntry.getManualProgressEntryType()));
    manualProgressEntryDto.setSubject(progressEntry.getSubject());
    manualProgressEntryDto.setMessageText(progressEntry.getMessageText());
    manualProgressEntryDto.setNote(progressEntry.getNote());
    manualProgressEntryDto.setCreatedBy(progressEntry.getCreatedBy());
    manualProgressEntryDto.setKeyDocumentType(progressEntry.getKeyDocumentType());
    manualProgressEntryDto.setKeyDocumentVersion(progressEntry.getKeyDocumentVersion());
    manualProgressEntryDto.setLocked(progressEntry.isLocked());
    fillGeneralProgressEntry(manualProgressEntryDto, progressEntry);
    return manualProgressEntryDto;
  }

  private static ProcessedInboxProgressEntryDto toInterfaceType(
      ProcessedInboxProgressEntry progressEntry) {
    ProcessedInboxProgressEntryDto processedInboxProgressEntryDto =
        new ProcessedInboxProgressEntryDto();
    processedInboxProgressEntryDto.setInboxProcedureId(
        progressEntry.getInboxProcedure().getExternalId());
    processedInboxProgressEntryDto.setInboxProgressEntryType(
        toInterfaceType(progressEntry.getInboxProgressEntryType()));
    processedInboxProgressEntryDto.setSubject(progressEntry.getSubject());
    processedInboxProgressEntryDto.setMessageText(progressEntry.getMessageText());
    processedInboxProgressEntryDto.setCreatedBy(progressEntry.getCreatedBy());
    fillGeneralProgressEntry(processedInboxProgressEntryDto, progressEntry);
    return processedInboxProgressEntryDto;
  }

  private static void fillGeneralProgressEntry(
      ProgressEntryDto progressEntryDto, ProgressEntry progressEntry) {
    progressEntryDto.setProgressEntryId(progressEntry.getExternalId());
    progressEntryDto.setCreatedAt(progressEntry.getCreatedAt());
    progressEntryDto.setModifiedAt(progressEntry.getModifiedAt());
    progressEntryDto.setFileReference(
        FileMapper.toInterfaceTypeAsReference(progressEntry.getFile()));
  }

  private static ManualProgressEntryTypeDto toInterfaceType(
      ManualProgressEntryType manualProgressEntryType) {
    return switch (manualProgressEntryType) {
      case EMAIL -> ManualProgressEntryTypeDto.EMAIL;
      case LETTER -> ManualProgressEntryTypeDto.LETTER;
      case PHONE_CALL -> ManualProgressEntryTypeDto.PHONE_CALL;
      case NOTE -> ManualProgressEntryTypeDto.NOTE;
      case IMAGE -> ManualProgressEntryTypeDto.IMAGE;
      case DOCUMENT -> ManualProgressEntryTypeDto.DOCUMENT;
    };
  }

  private static InboxProgressEntryTypeDto toInterfaceType(
      InboxProgressEntryType inboxProgressEntryType) {
    return switch (inboxProgressEntryType) {
      case PHONE_CALL -> InboxProgressEntryTypeDto.PHONE_CALL;
      case EMAIL -> InboxProgressEntryTypeDto.EMAIL;
      case LETTER -> InboxProgressEntryTypeDto.LETTER;
    };
  }

  private static TriggerTypeDto toInterfaceType(TriggerType triggerType) {
    return switch (triggerType) {
      case EMPLOYEE -> TriggerTypeDto.EMPLOYEE;
      case SYSTEM_AUTOMATIC -> TriggerTypeDto.SYSTEM_AUTOMATIC;
      case CITIZEN -> TriggerTypeDto.CITIZEN;
    };
  }

  public static ManualProgressEntry toDomainType(CreateManualProgressEntryRequest createRequest) {
    ManualProgressEntry manualProgressEntry = new ManualProgressEntry();
    manualProgressEntry.setManualProgressEntryType(
        toDomainType(createRequest.manualProgressEntryType()));
    manualProgressEntry.setSubject(createRequest.subject());
    manualProgressEntry.setMessageText(createRequest.messageText());
    manualProgressEntry.setNote(createRequest.note());
    manualProgressEntry.setKeyDocumentType(createRequest.keyDocumentType());
    return manualProgressEntry;
  }

  public static ManualProgressEntryHistoryDto toInterfaceType(
      RevisionEntry<ManualProgressEntry> manualProgressEntryRevisionEntry) {
    ManualProgressEntryHistoryDto manualProgressEntryHistoryDto =
        new ManualProgressEntryHistoryDto();
    manualProgressEntryHistoryDto.setManualProgressEntry(
        toInterfaceType(manualProgressEntryRevisionEntry.getEntity()));
    RevisionHistoryMapper.mapCommonFields(
        manualProgressEntryHistoryDto, manualProgressEntryRevisionEntry.getRevision());
    return manualProgressEntryHistoryDto;
  }
}
