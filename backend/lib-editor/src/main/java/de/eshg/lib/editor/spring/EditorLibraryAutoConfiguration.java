/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.spring;

import de.eshg.lib.editor.EditorController;
import de.eshg.lib.editor.TextBlockController;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@Import({
  EditorController.class,
  TextBlockController.class,
  EditorLibraryPrivateSecurityConfig.class,
})
public class EditorLibraryAutoConfiguration {}
