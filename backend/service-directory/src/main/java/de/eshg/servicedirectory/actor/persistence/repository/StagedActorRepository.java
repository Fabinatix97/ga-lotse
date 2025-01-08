/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.repository;

import de.eshg.servicedirectory.actor.persistence.entity.StagedActor;
import de.eshg.servicedirectory.staging.persistence.repository.StagedEntityRepository;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface StagedActorRepository extends StagedEntityRepository<StagedActor> {

  List<StagedActor> findAllByOrgUnitIdIn(Collection<UUID> orgUnitIds);
}
