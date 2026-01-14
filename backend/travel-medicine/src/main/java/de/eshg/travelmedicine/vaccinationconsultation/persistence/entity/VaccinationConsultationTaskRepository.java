/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.procedure.domain.repository.TaskRepository;

public interface VaccinationConsultationTaskRepository
    extends TaskRepository<VaccinationConsultationTask> {}
