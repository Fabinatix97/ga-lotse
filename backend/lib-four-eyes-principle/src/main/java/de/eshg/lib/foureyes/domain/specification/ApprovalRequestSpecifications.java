/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.specification;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest_;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ApprovalRequestSpecifications {

  private ApprovalRequestSpecifications() {}

  public static <T extends ApprovalRequest<?>> Specification<T> isOpen() {
    return (root, query, cb) -> cb.isNull(root.get(ApprovalRequest_.decision));
  }

  public static <T extends ApprovalRequest<?>> Specification<T> isNotCreatedByCurrentUser() {
    return (root, query, cb) -> {
      UUID currentUserId = CurrentUserHelper.getCurrentUserId();
      return cb.notEqual(root.get(ApprovalRequest_.createdBy), currentUserId);
    };
  }
}
