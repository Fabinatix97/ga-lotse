/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.repository;

import de.eshg.servicedirectory.orgunit.persistence.entity.StagedOrgUnit;
import de.eshg.servicedirectory.staging.persistence.repository.StagedEntityRepository;

public interface StagedOrgUnitRepository extends StagedEntityRepository<StagedOrgUnit> {}
