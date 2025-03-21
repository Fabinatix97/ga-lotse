/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.persistence;

import de.eshg.departmentinfo.domain.AbstractDepartmentInfoConfig;
import jakarta.persistence.AssociationOverride;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;

@Entity
@AssociationOverride(name = "departmentInfo", joinColumns = @JoinColumn(nullable = false))
public class BaseDepartmentInfoConfig extends AbstractDepartmentInfoConfig {}
