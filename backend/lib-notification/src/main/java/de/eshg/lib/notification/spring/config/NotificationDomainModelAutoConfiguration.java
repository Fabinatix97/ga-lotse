/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.spring.config;

import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;

@AutoConfiguration(before = JpaRepositoriesAutoConfiguration.class)
@AutoConfigurationPackage(
    basePackageClasses = {SimpleNotification.class, SimpleNotificationRepository.class})
public class NotificationDomainModelAutoConfiguration {}
