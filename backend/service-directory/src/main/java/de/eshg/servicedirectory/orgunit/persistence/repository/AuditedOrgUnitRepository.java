/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.persistence.repository;

import de.eshg.servicedirectory.orgunit.persistence.entity.AuditedOrgUnit;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditedOrgUnitRepository extends JpaRepository<AuditedOrgUnit, UUID> {}
