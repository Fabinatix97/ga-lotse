/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.repository;

import de.eshg.lib.procedure.domain.repository.TaskRepository;
import de.eshg.medicalregistry.domain.model.MedicalRegistryTask;

public interface MedicalRegistryTaskRepository extends TaskRepository<MedicalRegistryTask> {}
