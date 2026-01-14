/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.mapping;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.model.ApprovalRequestStatus;
import de.eshg.lib.foureyes.domain.model.Decision;
import de.eshg.lib.foureyes.domain.model.Operation;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import de.eshg.lib.foureyes.model.ApprovalRequestStatusDto;
import de.eshg.lib.foureyes.model.DecisionDto;
import de.eshg.lib.foureyes.model.OperationDto;
import org.springframework.stereotype.Service;

@Service
public final class ApprovalRequestMapper {

  private final EntityToApprovalRequestEntityMapper entityToApprovalRequestEntityMapper;

  public ApprovalRequestMapper(
      EntityToApprovalRequestEntityMapper entityToApprovalRequestEntityMapper) {
    this.entityToApprovalRequestEntityMapper = entityToApprovalRequestEntityMapper;
  }

  public static Decision toDomain(DecisionDto decisionDto) {
    return switch (decisionDto) {
      case DENIED -> Decision.DENIED;
      case GRANTED -> Decision.GRANTED;
    };
  }

  public ApprovalRequestDto toInterfaceType(ApprovalRequest<?> approvalRequest) {
    return new ApprovalRequestDto(
        approvalRequest.getExternalId(),
        toInterfaceType(approvalRequest.getStatus()),
        approvalRequest.getCreatedAt(),
        approvalRequest.getCreatedBy(),
        approvalRequest.getReason(),
        approvalRequest.getDecidedBy(),
        approvalRequest.getDecidedAt(),
        toInterfaceType(approvalRequest.getDecision()),
        toInterfaceType(approvalRequest.getOperation()),
        toInterfaceType(approvalRequest.getEntity()));
  }

  private ApprovalRequestEntityDto toInterfaceType(EntityWithExternalId entity) {
    if (entity == null) {
      return null;
    }

    return entityToApprovalRequestEntityMapper.toInterfaceType(entity);
  }

  private static OperationDto toInterfaceType(Operation operation) {
    return switch (operation) {
      case DELETE -> OperationDto.DELETE;
    };
  }

  private static ApprovalRequestStatusDto toInterfaceType(ApprovalRequestStatus status) {
    return switch (status) {
      case OPEN -> ApprovalRequestStatusDto.OPEN;
      case CLOSED -> ApprovalRequestStatusDto.CLOSED;
    };
  }

  private static DecisionDto toInterfaceType(Decision decision) {
    return switch (decision) {
      case null -> null;
      case DENIED -> DecisionDto.DENIED;
      case GRANTED -> DecisionDto.GRANTED;
    };
  }

  @FunctionalInterface
  public interface EntityToApprovalRequestEntityMapper {
    ApprovalRequestEntityDto toInterfaceType(EntityWithExternalId entity);
  }
}
