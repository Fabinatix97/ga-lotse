/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.repository.GdprValidationTaskRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GdprValidationTaskService {
  private final GdprValidationTaskRepository repository;
  private final Clock clock;
  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskService.class);

  public GdprValidationTaskService(GdprValidationTaskRepository repository, Clock clock) {
    this.repository = repository;
    this.clock = clock;
  }

  public GdprValidationTask add(GdprValidationTask procedure) {
    Optional<GdprValidationTask> existingTask =
        repository.findByProcedureId(procedure.getProcedureId());
    if (existingTask.isPresent()) {
      log.info(
          "A GdprValidationTask already exists for GdprProcedure with id {}",
          existingTask.get().getProcedureId());
      return existingTask.get();
    }

    Instant now = clock.instant();
    procedure.setCreatedAt(now);
    procedure.setModifiedAt(now);

    return repository.save(procedure);
  }
}
