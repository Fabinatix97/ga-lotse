/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.repository;

import static org.springframework.data.jpa.domain.Specification.*;

import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest_;
import de.eshg.lib.foureyes.domain.specification.ApprovalRequestSpecifications;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ApprovalRequestRepository<T extends ApprovalRequest<?>>
    extends JpaRepository<T, Long>, JpaSpecificationExecutor<T> {
  Optional<T> findByExternalId(UUID externalId);

  default List<T> findAllByStatusIsOpenAndUserIsNotCurrent(Specification<T> spec) {
    return findAll(
        where(spec)
            .and(ApprovalRequestSpecifications.isNotCreatedByCurrentUser())
            .and(ApprovalRequestSpecifications.isOpen()),
        Sort.by(Direction.DESC, ApprovalRequest_.CREATED_AT, ApprovalRequest_.ID));
  }
}
