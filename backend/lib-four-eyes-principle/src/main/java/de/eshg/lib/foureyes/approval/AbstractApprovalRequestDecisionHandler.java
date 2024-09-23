/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.approval;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.model.Decision;

public abstract class AbstractApprovalRequestDecisionHandler<T extends ApprovalRequest<?>> {
  protected abstract void grant(T approvalRequest);

  protected abstract void deny(T approvalRequest);

  protected abstract Class<T> getHandledType();

  public final void handle(ApprovalRequest<?> approvalRequest, Decision decision) {
    if (!this.getHandledType().isInstance(approvalRequest)) {
      throw new IllegalStateException(
          "Cannot handle approval request entity %s, can only handle %s"
              .formatted(approvalRequest.getClass(), getHandledType()));
    }

    T typedApprovalRequest = this.getHandledType().cast(approvalRequest);

    if (decision == Decision.GRANTED) {
      grant(typedApprovalRequest);
    } else if (decision == Decision.DENIED) {
      deny(typedApprovalRequest);
    }
  }

  final boolean canHandle(Class<?> approvalRequestClass) {
    return getHandledType().isAssignableFrom(approvalRequestClass);
  }
}
