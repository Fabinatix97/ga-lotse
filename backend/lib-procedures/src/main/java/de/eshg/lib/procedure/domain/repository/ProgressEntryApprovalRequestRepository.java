/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.repository.ApprovalRequestRepository;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;

public interface ProgressEntryApprovalRequestRepository
    extends ApprovalRequestRepository<ApprovalRequest<?>> {

  @Query(
      """
    select mpear from ManualProgressEntryDeletionApprovalRequest mpear
    join fetch mpear.manualProgressEntry mpe
    where mpe.procedureId = :procedureId
    and mpear.createdBy <> :userId
    and mpear.decision is null
    """)
  List<ManualProgressEntryDeletionApprovalRequest> findManualProgressEntryDeletionRequests(
      Long procedureId, UUID userId);

  @Query(
      """
    select fdar from FileDeletionApprovalRequest fdar
    join fdar.file f
    join ProgressEntry pe on pe.file = f
    where pe.procedureId = :procedureId
    and fdar.createdBy <> :userId
    and fdar.decision is null
    """)
  List<FileDeletionApprovalRequest> findFileDeletionRequests(Long procedureId, UUID userId);
}
