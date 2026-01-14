/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.domain.repository;

import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryTask;

public interface MedicalRegistryTaskRepository extends TaskRepository<MedicalRegistryTask> {}
