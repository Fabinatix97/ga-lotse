/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.spring;

import de.eshg.lib.procedure.domain.model.AssignmentHistoryItem;
import de.eshg.lib.procedure.domain.repository.InboxProcedureRepository;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(
    basePackageClasses = {AssignmentHistoryItem.class, InboxProcedureRepository.class})
@PropertySource("classpath:procedure-library-domain-model.properties")
public class ProcedureLibraryDomainModelAutoConfiguration {}
