/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.spring;

import de.eshg.lib.foureyes.approval.ApprovalRequestController;
import de.eshg.lib.foureyes.approval.ApprovalRequestDecisionHandlerRegistry;
import de.eshg.lib.foureyes.domain.model.ApprovalRequest;
import de.eshg.lib.foureyes.domain.repository.ApprovalRequestRepository;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(
    basePackageClasses = {ApprovalRequest.class, ApprovalRequestRepository.class})
@Import({
  ApprovalRequestController.class,
  ApprovalRequestMapper.class,
  ApprovalRequestDecisionHandlerRegistry.class
})
public class FourEyesPrincipleAutoConfiguration {}
