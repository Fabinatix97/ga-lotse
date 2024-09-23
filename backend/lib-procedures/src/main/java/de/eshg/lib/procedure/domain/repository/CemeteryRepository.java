/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.Cemetery;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CemeteryRepository extends JpaRepository<Cemetery, Long> {

  long countByFormerExternalId(UUID formerExternalId);
}
