/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.approval;

import de.eshg.lib.foureyes.api.ApprovalRequestApi;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.model.ApprovalRequestStatus;
import de.eshg.lib.foureyes.domain.model.Decision;
import de.eshg.lib.foureyes.domain.repository.GenericApprovalRequestRepository;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.DecisionDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Clock;
import java.util.UUID;
import org.springframework.data.domain.AuditorAware;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "ApprovalRequest")
public class ApprovalRequestController implements ApprovalRequestApi {

  private final GenericApprovalRequestRepository approvalRequestRepository;
  private final ApprovalRequestDecisionHandlerRegistry approvalRequestDecisionHandlerRegistry;
  private final ApprovalRequestMapper approvalRequestMapper;
  private final AuditorAware<UUID> auditorAware;
  private final Clock clock;

  public ApprovalRequestController(
      GenericApprovalRequestRepository approvalRequestRepository,
      ApprovalRequestDecisionHandlerRegistry approvalRequestDecisionHandlerRegistry,
      ApprovalRequestMapper approvalRequestMapper,
      AuditorAware<UUID> auditorAware,
      Clock clock) {
    this.approvalRequestRepository = approvalRequestRepository;
    this.approvalRequestDecisionHandlerRegistry = approvalRequestDecisionHandlerRegistry;
    this.approvalRequestMapper = approvalRequestMapper;
    this.auditorAware = auditorAware;
    this.clock = clock;
  }

  @Override
  @Transactional(readOnly = true)
  public ApprovalRequestDto getApprovalRequest(UUID approvalRequestId) {
    ApprovalRequest<?> approvalRequest = getApprovalRequestOrThrow(approvalRequestId);
    return approvalRequestMapper.toInterfaceType(approvalRequest);
  }

  @Override
  @Transactional
  public void decideApprovalRequest(UUID approvalRequestId, DecisionDto decisionDto) {
    ApprovalRequest<?> approvalRequest = getApprovalRequestOrThrow(approvalRequestId);
    UUID currentUserId = auditorAware.getCurrentAuditor().orElseThrow();

    if (approvalRequest.getCreatedBy().equals(currentUserId)) {
      throw new BadRequestException(
          ErrorCode.INSUFFICIENT_USER_RIGHTS, "ApprovalRequest cannot be decided by creator");
    }

    if (approvalRequest.getStatus() != ApprovalRequestStatus.OPEN) {
      throw new BadRequestException("ApprovalRequest is closed");
    }

    Decision decision = ApprovalRequestMapper.toDomain(decisionDto);

    approvalRequest.decide(decision, currentUserId, clock);
    approvalRequestDecisionHandlerRegistry
        .getHandler(approvalRequest)
        .handle(approvalRequest, decision);
  }

  private ApprovalRequest<?> getApprovalRequestOrThrow(UUID approvalRequestId) {
    return approvalRequestRepository
        .findByExternalId(approvalRequestId)
        .orElseThrow(() -> new NotFoundException("ApprovalRequest not found"));
  }
}
