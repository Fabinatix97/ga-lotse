/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.persistence.repository;

import de.eshg.servicedirectory.actor.persistence.entity.ActorMetadata;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorMetadataRepository extends JpaRepository<ActorMetadata, UUID> {}
