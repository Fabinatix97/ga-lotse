/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.persistence.repository;

import de.eshg.servicedirectory.rule.persistence.entity.StagedRule;
import de.eshg.servicedirectory.staging.persistence.repository.StagedEntityRepository;

public interface StagedRuleRepository extends StagedEntityRepository<StagedRule> {}
