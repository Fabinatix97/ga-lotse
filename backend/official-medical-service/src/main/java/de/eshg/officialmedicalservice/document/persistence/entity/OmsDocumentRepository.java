/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.persistence.entity;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OmsDocumentRepository extends JpaRepository<OmsDocument, UUID> {}
