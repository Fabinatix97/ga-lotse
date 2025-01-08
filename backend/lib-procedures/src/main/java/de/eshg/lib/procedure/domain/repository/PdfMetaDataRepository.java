/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.PdfMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfMetaDataRepository extends JpaRepository<PdfMetaData, Long> {}
