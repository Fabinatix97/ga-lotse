/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.testhelper;

import de.eshg.filejockey.config.FileJockeyProperties;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnTestHelperEnabled
public class TestHelperService {

  private final FileJockeyProperties properties;

  private final TestHelperOutputFileService outputFileService;

  public TestHelperService(
      FileJockeyProperties properties, TestHelperOutputFileService outputFileService) {
    this.properties = properties;
    this.outputFileService = outputFileService;
  }

  public void createSampleOutputFile(String equipmentSelector, String correlationId) {
    FileJockeyProperties.Device device = properties.getDeviceOrThrow(equipmentSelector);
    String correlationIdEmbedding = buildCorrelationIdEmbedding(correlationId, device);

    FileJockeyProperties.DeviceOutputFileProperties outputFileProperties = device.output();
    outputFileService.createOutputFileWithTemplate(
        outputFileProperties.folder(), device.charset(), correlationIdEmbedding);
  }

  private String buildCorrelationIdEmbedding(
      String correlationId, FileJockeyProperties.Device device) {
    FileJockeyProperties.DeviceOutputFileProperties output = device.output();
    return (output.embeddingPrefix() + correlationId + output.embeddingPostfix()).trim();
  }
}
