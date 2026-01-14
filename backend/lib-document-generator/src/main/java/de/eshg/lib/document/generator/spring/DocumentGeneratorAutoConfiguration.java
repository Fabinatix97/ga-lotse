/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.document.generator.spring;

import de.eshg.lib.document.generator.DocumentGenerator;
import de.eshg.lib.document.generator.PdfCreator;
import de.eshg.lib.document.generator.XhtmlTemplateProcessor;
import de.eshg.lib.document.generator.department.DepartmentLogoClient;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@Import({
  DocumentGenerator.class,
  XhtmlTemplateProcessor.class,
  PdfCreator.class,
  DepartmentLogoClient.class
})
public class DocumentGeneratorAutoConfiguration {}
