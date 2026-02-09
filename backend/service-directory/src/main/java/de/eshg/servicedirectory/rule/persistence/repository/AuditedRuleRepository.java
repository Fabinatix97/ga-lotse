/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.repository;

import de.eshg.servicedirectory.rule.persistence.entity.AuditedRule;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuditedRuleRepository
    extends JpaRepository<AuditedRule, UUID>, JpaSpecificationExecutor<AuditedRule> {
  List<AuditedRule> findAllByActiveIsTrue();
}
