/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.persistence.entity;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OmsDocumentRepository extends JpaRepository<OmsDocument, UUID> {}
