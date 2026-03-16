/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.testhelper;

import de.eshg.rest.service.error.InternalServerErrorException;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnTestHelperEnabled
public class TestHelperOutputFileService {

  private static final String TEMPLATE_PATH = "test-helper/testhelper-device-output-template.gdt";
  private static final String CORRELATION_ID_EMBEDDING_KEY = "CORRELATION_ID_EMBEDDING";

  private final ResourceLoader resourceLoader;

  public TestHelperOutputFileService(ResourceLoader resourceLoader) {
    this.resourceLoader = resourceLoader;
  }

  public void createOutputFileWithTemplate(
      Path outputFileFolder, Charset charset, String correlationIdEmbedding) {
    String template = loadTemplate(TEMPLATE_PATH);
    String rendered =
        render(template, Map.of(CORRELATION_ID_EMBEDDING_KEY, correlationIdEmbedding));

    writeContent(outputFileFolder, charset, rendered);
  }

  private String loadTemplate(String resourcePath) {
    Resource template = resourceLoader.getResource("classpath:" + resourcePath);
    try (InputStream inputStream = template.getInputStream()) {
      return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new InternalServerErrorException("Could not write file");
    }
  }

  private String render(String template, Map<String, String> values) {
    String result = template;
    for (var entry : values.entrySet()) {
      result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
    }
    return result;
  }

  private static void writeContent(Path outputFileFolder, Charset charset, String content) {
    try {
      Files.createDirectories(outputFileFolder);
      Path file = Files.createTempFile(outputFileFolder, "output-", ".gdt");
      Files.writeString(file, content, charset);
    } catch (IOException e) {
      throw new InternalServerErrorException("Could not write file");
    }
  }
}
