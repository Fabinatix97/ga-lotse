/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.scheduling.spring;

import de.eshg.lib.scheduling.Shedlock;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@Import({
  SchedulingConfiguration.class,
  Shedlock.class,
})
public class SchedulingLibraryAutoConfiguration {}
