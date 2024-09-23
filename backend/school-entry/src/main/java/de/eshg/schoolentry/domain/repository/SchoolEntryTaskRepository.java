/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.repository;

import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.schoolentry.domain.model.SchoolEntryTask;

public interface SchoolEntryTaskRepository extends TaskRepository<SchoolEntryTask> {}
