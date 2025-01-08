/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacklistDefinitionRepository extends JpaRepository<PacklistDefinition, UUID> {}
