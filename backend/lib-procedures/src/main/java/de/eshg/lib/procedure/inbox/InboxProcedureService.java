/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.inbox;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.file.MultipartFileParser.parseFile;
import static de.eshg.lib.procedure.file.MultipartFileParser.validateProgressEntryTypeSupportsFileType;
import static de.eshg.lib.procedure.model.GetInboxProceduresSortOrderDto.ASC;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.domain.model.InboxProcedureStatus;
import de.eshg.lib.procedure.domain.model.InboxProcedure_;
import de.eshg.lib.procedure.domain.model.InboxProgressEntry;
import de.eshg.lib.procedure.domain.model.Mail;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.repository.InboxProcedureRepository;
import de.eshg.lib.procedure.mapping.InboxProcedureMapper;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.CreateInboxProcedureRequest;
import de.eshg.lib.procedure.model.FileMetaDataDto;
import de.eshg.lib.procedure.model.GetInboxProceduresFilterOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresPaginationOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresSortByDto;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOptions;
import de.eshg.lib.procedure.model.GetInboxProceduresSortOrderDto;
import de.eshg.lib.procedure.model.InboxProcedureStatusDto;
import de.eshg.lib.procedure.model.ProcedureTypeDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.time.Clock;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InboxProcedureService {

  private final InboxProcedureRepository inboxProcedureRepository;
  private final Clock clock;

  public InboxProcedureService(InboxProcedureRepository inboxProcedureRepository, Clock clock) {
    this.inboxProcedureRepository = inboxProcedureRepository;
    this.clock = clock;
  }

  public Page<InboxProcedure> getInboxProcedures(
      GetInboxProceduresFilterOptions filterOptions,
      GetInboxProceduresSortOptions sortOptions,
      GetInboxProceduresPaginationOptions paginationOptions) {
    return inboxProcedureRepository.findAll(
        Specification.where(
                inboxProcedureTypes(
                    filterOptions.inboxProcedureType(), filterOptions.includeUntyped()))
            .and(inboxProcedureStatus(filterOptions.inboxProcedureStatus())),
        PageRequest.of(
            paginationOptions.pageNumber(),
            paginationOptions.pageSize(),
            getSort(sortOptions.sortOrder(), sortOptions.sortBy())));
  }

  private Sort getSort(
      GetInboxProceduresSortOrderDto sortOrder, GetInboxProceduresSortByDto sortBy) {
    Sort.Direction direction = sortOrder == ASC ? Sort.Direction.ASC : Sort.Direction.DESC;
    String[] properties =
        switch (sortBy) {
          case CREATED_AT -> new String[] {InboxProcedure_.CREATED_AT, BaseEntity_.ID};
        };
    return Sort.by(direction, properties);
  }

  private Specification<InboxProcedure> inboxProcedureTypes(
      Set<ProcedureTypeDto> inboxProcedureTypes, Boolean includeUntyped) {

    if (CollectionUtils.isEmpty(inboxProcedureTypes)) {
      return null;
    }

    Set<ProcedureType> types = mapEnumSet(inboxProcedureTypes, ProcedureMapper::toDomainType);
    if (includeUntyped != null && includeUntyped) {
      return ((root, query, cb) ->
          cb.or(
              root.get(InboxProcedure_.procedureType).isNull(),
              root.get(InboxProcedure_.procedureType).in(types)));
    } else {
      return ((root, query, cb) -> root.get(InboxProcedure_.procedureType).in(types));
    }
  }

  private Specification<InboxProcedure> inboxProcedureStatus(
      Set<InboxProcedureStatusDto> inboxProcedureStatus) {

    if (CollectionUtils.isEmpty(inboxProcedureStatus)) {
      return null;
    }

    Set<InboxProcedureStatus> status =
        mapEnumSet(inboxProcedureStatus, InboxProcedureMapper::toDomainType);
    return ((root, query, cb) -> root.get(InboxProcedure_.inboxProcedureStatus).in(status));
  }

  public InboxProcedure getInboxProcedureOrThrow(UUID inboxProcedureId) {
    return inboxProcedureRepository
        .findByExternalId(inboxProcedureId)
        .orElseThrow(() -> new NotFoundException("Inbox procedure not found"));
  }

  public InboxProcedure addInboxProcedure(
      CreateInboxProcedureRequest createInboxProcedureRequest,
      MultipartFile file,
      FileMetaDataDto fileMetaData)
      throws IOException {
    InboxProcedure inboxProcedure =
        InboxProcedureMapper.createInboxProcedure(createInboxProcedureRequest, clock);

    if (Optional.ofNullable(file).isPresent()) {
      InboxProgressEntry inboxProgressEntry = inboxProcedure.getInboxProgressEntry();
      validateProgressEntryTypeSupportsFileType(inboxProgressEntry, file);

      File parsedFile = parseFile(file);
      Optional.ofNullable(fileMetaData)
          .map(FileMetaDataDto::getDescription)
          .ifPresent(parsedFile.getMetaData()::setDescription);

      copySubjectAndMessageTextFromMailIfNecessary(inboxProgressEntry, parsedFile);
      inboxProgressEntry.setFile(parsedFile);
    }

    return inboxProcedureRepository.save(inboxProcedure);
  }

  private void copySubjectAndMessageTextFromMailIfNecessary(
      InboxProgressEntry inboxProgressEntry, File file) {
    if (!(file instanceof Mail mail)) {
      return;
    }

    if (inboxProgressEntry.getSubject() != null || inboxProgressEntry.getMessageText() != null) {
      throw new BadRequestException(
          "Subject and message text are parsed from eml and should not be given");
    }

    inboxProgressEntry.setSubject(mail.getMetaData().getSubject());
    inboxProgressEntry.setMessageText(mail.getMetaData().getMessageText());
  }

  public InboxProcedure updateInboxProcedureStatus(
      UUID inboxProcedureId, InboxProcedureStatusDto inboxProcedureStatus) {
    InboxProcedure inboxProcedure = getInboxProcedureOrThrow(inboxProcedureId);
    inboxProcedure.updateInboxProcedureStatus(
        InboxProcedureMapper.toDomainType(inboxProcedureStatus), clock);
    inboxProcedureRepository.flush();
    return inboxProcedure;
  }
}
