/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.teis;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TeisConfiguration {

  @Bean
  DocumentBuilderFactory documentBuilderFactory() throws ParserConfigurationException {
    System.setProperty("jdk.xml.dtd.support", "deny");
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
    dbf.setFeature(javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING, true);
    return dbf;
  }
}
