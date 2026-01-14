/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid.persistence.repository;

import de.eshg.base.bundid.persistence.entity.BundIdPersonLink;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BundIdPersonLinkRepository extends JpaRepository<BundIdPersonLink, Long> {

  Optional<BundIdPersonLink> findByBpk2(String bpk2);
}
