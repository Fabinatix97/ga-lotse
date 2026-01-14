/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.repository;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ApprovalRequestRepository<T extends ApprovalRequest<?>>
    extends JpaRepository<T, Long>, JpaSpecificationExecutor<T> {
  Optional<T> findByExternalId(UUID externalId);
}
