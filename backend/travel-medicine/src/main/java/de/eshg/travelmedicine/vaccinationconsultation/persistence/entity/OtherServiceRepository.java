/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtherServiceRepository extends JpaRepository<OtherService, UUID> {}
