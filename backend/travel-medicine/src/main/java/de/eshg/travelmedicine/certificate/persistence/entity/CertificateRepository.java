/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate.persistence.entity;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

  @Query(
      "select c from Certificate c where c.procedureStep.vaccinationConsultation.externalId =:procedureId order by c.createdAt, c.id")
  List<Certificate> findCertificatesByProcedureId(UUID procedureId);
}
