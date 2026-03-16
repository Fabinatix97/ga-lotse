/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.persistence;

import de.eshg.officialmedicalservice.assessment.persistence.entity.MedicalAssessment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MedicalAssessmentRepository extends JpaRepository<MedicalAssessment, Long> {
  @Query(
      "select o from MedicalAssessment o join fetch OmsProcedure p on o.procedure = p where p.externalId = :uuid")
  List<MedicalAssessment> findAllByProcedureExternalId(@Param("uuid") UUID uuid);

  Optional<MedicalAssessment> findByExternalId(UUID externalId);
}
