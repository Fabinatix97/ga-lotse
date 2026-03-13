/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class ObjectTypeHierarchyReader {

  private static final String HIERARCHY_JSON_FILE =
      "/de/eshg/inspection/objecttype/objectTypeHierarchy.json";

  private final ObjectMapper objectMapper;
  private final ClassPathResource hierarchyJsonFile;

  private JsonTreeNode rootNode;
  private final List<String> flatObjectTypes = new ArrayList<>();

  public ObjectTypeHierarchyReader(
      @Value(HIERARCHY_JSON_FILE) ClassPathResource hierarchyJsonFile, ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    Assert.isTrue(hierarchyJsonFile.exists(), hierarchyJsonFile + " does not exist");
    this.hierarchyJsonFile = hierarchyJsonFile;
  }

  @PostConstruct
  public void readTree() throws IOException {
    rootNode = objectMapper.readValue(hierarchyJsonFile.getInputStream(), JsonTreeNode.class);

    traverseTree(rootNode);
  }

  public JsonTreeNode getRootNode() {
    return rootNode;
  }

  public List<String> getFlatObjectTypes() {
    return flatObjectTypes;
  }

  private void traverseTree(JsonTreeNode node) {
    Map<Boolean, List<JsonTreeNode>> children =
        node.children().stream()
            .collect(Collectors.partitioningBy(child -> child.children() == null));
    children.get(true).forEach(child -> flatObjectTypes.add(child.name()));
    children.get(false).forEach(this::traverseTree);
  }

  public record JsonTreeNode(String name, Integer originalIndex, List<JsonTreeNode> children) {}
}
