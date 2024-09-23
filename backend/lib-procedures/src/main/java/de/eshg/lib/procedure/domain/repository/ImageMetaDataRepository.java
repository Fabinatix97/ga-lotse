/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.ImageMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageMetaDataRepository extends JpaRepository<ImageMetaData, Long> {}
