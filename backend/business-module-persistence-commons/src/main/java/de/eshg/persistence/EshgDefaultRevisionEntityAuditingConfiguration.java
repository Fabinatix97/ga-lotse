/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(basePackageClasses = DefaultRevisionEntity.class)
@ConditionalOnProperty("de.eshg.envers.auditing.enabled")
public class EshgDefaultRevisionEntityAuditingConfiguration {}
