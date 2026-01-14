/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.persistence.repository;

import de.eshg.base.muk.persistence.entity.MukFacilityLink;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MukFacilityLinkRepository extends JpaRepository<MukFacilityLink, Long> {

  Optional<MukFacilityLink> findByDataTransmitterPseudonymId(String dataTransmitterPseudonymId);
}
