/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AppointmentBlockGroupRepository
    extends JpaRepository<AppointmentBlockGroup, Long>,
        JpaSpecificationExecutor<AppointmentBlockGroup> {}
