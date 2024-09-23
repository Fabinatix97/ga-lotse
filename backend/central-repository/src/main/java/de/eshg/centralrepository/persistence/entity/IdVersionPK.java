/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Embeddable
public record IdVersionPK(Long id, Integer version) {}
