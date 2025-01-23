/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.Cemetery;
import java.time.Instant;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CemeteryRepository extends JpaRepository<Cemetery, Long> {

  long countByFormerExternalId(UUID formerExternalId);

  Stream<Cemetery> findAllByOrderById();

  long deleteByDeleteAtBefore(Instant deleteAt);
}
