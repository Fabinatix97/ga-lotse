/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
  ContactClient.class,
  ContactLibraryInternalSecurityConfig.class,
  ContactEventCallbackController.class
})
public class ContactLibraryAutoConfiguration {}
