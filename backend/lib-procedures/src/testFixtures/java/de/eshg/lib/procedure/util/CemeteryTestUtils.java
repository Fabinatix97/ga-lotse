/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import de.eshg.lib.procedure.domain.model.Cemetery;
import de.eshg.lib.procedure.domain.repository.CemeteryRepository;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CemeteryTestUtils {

  private final CemeteryRepository cemeteryRepository;
  private final ObjectMapper objectMapper;

  CemeteryTestUtils(CemeteryRepository cemeteryRepository, ObjectMapper objectMapper) {
    this.cemeteryRepository = cemeteryRepository;
    this.objectMapper = objectMapper;
  }

  @Transactional(readOnly = true)
  public String cemeteryContentAsJsonString() {
    return cemeteryRepository
        .findAllByOrderById()
        .map(Cemetery::getContent)
        .map(this::prettyJson)
        .collect(Collectors.joining(",\n", "[\n", "\n]"));
  }

  @Transactional(readOnly = true)
  public List<Cemetery> cemeteryEntities() {
    return cemeteryRepository.findAllByOrderById().toList();
  }

  private String prettyJson(String source) {
    try (JsonParser parser = objectMapper.createParser(source)) {
      TreeNode result = parser.readValueAsTree();
      return objectMapper
          .copy()
          .enable(SerializationFeature.INDENT_OUTPUT)
          .writeValueAsString(result);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }
}
