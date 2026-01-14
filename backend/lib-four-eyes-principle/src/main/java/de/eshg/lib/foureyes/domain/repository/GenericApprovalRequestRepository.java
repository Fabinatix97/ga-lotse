/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.repository;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;

public interface GenericApprovalRequestRepository
    extends ApprovalRequestRepository<ApprovalRequest<?>> {}
