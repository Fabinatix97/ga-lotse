/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.repository;

import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.staging.persistence.repository.StagedEntityRepository;
import java.util.List;

public interface StagedRuleRepository extends StagedEntityRepository<StagedRule> {
  List<StagedRule> findAllByActiveIsTrue();
}
