/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement.persistence;

import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InformationStatementRepository extends JpaRepository<InformationStatement, UUID> {}
