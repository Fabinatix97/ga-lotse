/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.file.persistence.entity;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OmsFileRepository extends JpaRepository<OmsFile, UUID> {}
