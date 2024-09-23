/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.AbstractNotificationService;
import de.eshg.lib.notification.api.ManualProgressEntryDeletionApprovalRequestNotificationDto;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.domain.repository.ManualProgressEntryDeletionApprovalRequestNotificationRepository;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ManualProgressEntryDeletionApprovalRequestNotificationService
    extends AbstractNotificationService<ManualProgressEntryDeletionApprovalRequestNotification> {

  private final ProcedureRepository<?> procedureRepository;

  protected ManualProgressEntryDeletionApprovalRequestNotificationService(
      ManualProgressEntryDeletionApprovalRequestNotificationRepository notificationRepository,
      ProcedureRepository<?> procedureRepository,
      BusinessModule businessModule) {
    super(notificationRepository, businessModule);
    this.procedureRepository = procedureRepository;
  }

  @Override
  protected ManualProgressEntryDeletionApprovalRequestNotificationDto toInterface(
      ManualProgressEntryDeletionApprovalRequestNotification notification) {

    ManualProgressEntry manualProgressEntry =
        notification.getApprovalRequest().getManualProgressEntry();
    UUID procedureExternalId =
        procedureRepository.findExternalIdForId(manualProgressEntry.getProcedureId()).orElseThrow();

    return new ManualProgressEntryDeletionApprovalRequestNotificationDto(
        notification.getExternalId(),
        notification.getCreatedAt(),
        notification.getReadAt(),
        this.businessModule,
        notification.getCreatedByUserId(),
        procedureExternalId,
        manualProgressEntry.getManualProgressEntryType().name());
  }
}
