/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.procedure.domain.model.FileAware;
import de.eshg.lib.procedure.domain.model.InboxProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.repository.InboxProgressEntryRepository;
import de.eshg.lib.procedure.domain.repository.ProgressEntryRepository;
import de.eshg.rest.service.error.BadRequestException;

public class FileAwareResolver {

  private final InboxProgressEntryRepository inboxProgressEntryRepository;
  private final ProgressEntryRepository progressEntryRepository;

  public FileAwareResolver(
      InboxProgressEntryRepository inboxProgressEntryRepository,
      ProgressEntryRepository progressEntryRepository) {
    this.inboxProgressEntryRepository = inboxProgressEntryRepository;
    this.progressEntryRepository = progressEntryRepository;
  }

  public FileAware resolve(FileAware fileAware) {
    return switch (fileAware) {
      case ManualProgressEntry manualProgressEntry ->
          progressEntryRepository
              .findByExternalId(manualProgressEntry.getExternalId())
              .filter(FileAware.class::isInstance)
              .map(FileAware.class::cast)
              .orElseThrow(
                  () -> new BadRequestException("Could not resolve " + getClassName(fileAware)));
      case InboxProgressEntry inboxProgressEntry ->
          inboxProgressEntryRepository
              .findByExternalId(inboxProgressEntry.getExternalId())
              .orElseThrow(
                  () -> new BadRequestException("Could not resolve " + getClassName(fileAware)));
      default ->
          throw new BadRequestException("Unsupported file aware type: " + getClassName(fileAware));
    };
  }

  private String getClassName(FileAware fileAware) {
    return fileAware.getClass().getSimpleName();
  }
}
