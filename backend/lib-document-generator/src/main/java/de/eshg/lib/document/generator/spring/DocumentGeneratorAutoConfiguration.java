/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.spring;

import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.PdfCreator;
import de.eshg.lib.document.generator.XhtmlTemplateProcessor;
import de.eshg.lib.document.generator.department.DepartmentClient;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
  DocumentGenerator.class,
  XhtmlTemplateProcessor.class,
  PdfCreator.class,
  DepartmentClient.class
})
public class DocumentGeneratorAutoConfiguration {}
