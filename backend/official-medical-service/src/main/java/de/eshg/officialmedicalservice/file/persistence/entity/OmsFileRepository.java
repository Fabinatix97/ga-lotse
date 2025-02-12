/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.file.persistence.entity;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OmsFileRepository extends JpaRepository<OmsFile, UUID> {}
