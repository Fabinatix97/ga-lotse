/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ServiceRepository extends JpaRepository<VcService, UUID> {
  List<VcService> findAllByVaccinationConsultationExternalIdOrderById(UUID procedureId);

  List<VcService> findAllByProcedureStepIdOrderById(UUID procedureStepId);

  @Query(value = "from VcService vcs where vcs.id in (:ids) order by vcs.id")
  List<VcService> findAllByIdOrderById(@Param("ids") Iterable<UUID> ids);
}
