/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.api;

import de.eshg.lib.foureyes.model.ApprovalRequestDto;
import de.eshg.lib.foureyes.model.DecisionDto;
import de.eshg.rest.service.security.config.BaseUrls.FourEyesLibrary;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(FourEyesLibrary.APPROVAL_REQUESTS_API)
public interface ApprovalRequestApi {

  @GetExchange("/{approvalRequestId}")
  ApprovalRequestDto getApprovalRequest(@PathVariable("approvalRequestId") UUID approvalRequestId);

  @PutExchange("/{approvalRequestId}/decision")
  void decideApprovalRequest(
      @PathVariable("approvalRequestId") UUID approvalRequestId,
      @RequestBody DecisionDto decisionDto);
}
