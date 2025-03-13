/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ext.SqlBlobSerializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module.Feature;
import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.domain.model.GenericEntity;
import java.io.UncheckedIOException;
import java.sql.Blob;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.stream.Streams;
import org.springframework.stereotype.Component;

@Component
public class SerializationService {

  private final ObjectMapper jsonObjectMapper;

  public SerializationService(ObjectMapper objectMapper) {
    jsonObjectMapper =
        objectMapper
            .copy()
            .registerModule(new Hibernate6Module().enable(Feature.FORCE_LAZY_LOADING))
            .registerModule(new SimpleModule().addSerializer(Blob.class, new SqlBlobSerializer()))
            .enable(SerializationFeature.INDENT_OUTPUT)
            .setVisibility(PropertyAccessor.ALL, Visibility.NONE)
            .setVisibility(PropertyAccessor.FIELD, Visibility.ANY)
            .addMixIn(GenericEntity.class, GenericEntityMixin.class);
  }

  public String toJson(GenericEntity<?> entity) {
    try {
      return jsonObjectMapper.writeValueAsString(entity);
    } catch (JsonProcessingException e) {
      throw new UncheckedIOException(
          "Error during serializing object of type " + entity.getClass().getTypeName() + " as json",
          e);
    }
  }

  public byte[] toNestedZip(String entryNamePrefix, List<? extends EntityWithExternalId> entities) {
    return toNestedZip(entryNamePrefix, entities, o -> {});
  }

  public byte[] toNestedZip(
      String entryNamePrefix,
      List<? extends EntityWithExternalId> entities,
      ObjectMapperCustomizer objectMapperCustomizer) {
    ZipFileWrapper zipFileWrapper = new ZipFileWrapper();
    for (EntityWithExternalId entity : entities) {
      String entryBaseName = entryNamePrefix + entity.getExternalId().toString();
      zipFileWrapper.addEntry(
          entryBaseName + ".zip",
          toZip(entryBaseName, entity, (n, z) -> {}, objectMapperCustomizer));
    }
    return zipFileWrapper.asByteArray();
  }

  public byte[] toZip(String dataFileBaseName, EntityWithExternalId entity) {
    return toZip(dataFileBaseName, entity, (n, z) -> {}, o -> {});
  }

  public byte[] toZip(
      String dataFileBaseName,
      EntityWithExternalId entity,
      ZipEditor zipEditor,
      ObjectMapperCustomizer objectMapperCustomizer) {
    ZipFileWrapper zipFileWrapper = new ZipFileWrapper();

    ObjectMapper objectMapper = createObjectMapper(zipFileWrapper, objectMapperCustomizer);

    JsonNode jsonNode = toJsonNode(entity, objectMapper);
    zipEditor.filter(jsonNode, zipFileWrapper);
    String jsonNodeAsCsv = jsonNodeToCsv(entity.getClass().getSimpleName(), jsonNode);
    zipFileWrapper.addEntry(dataFileBaseName + ".csv", jsonNodeAsCsv.getBytes());
    zipEditor.filter(jsonNode, zipFileWrapper);

    return zipFileWrapper.asByteArray();
  }

  private ObjectMapper createObjectMapper(
      ZipFileWrapper zipFileWrapper, ObjectMapperCustomizer objectMapperCustomizer) {
    ObjectMapper objectMapper =
        jsonObjectMapper
            .copy()
            .registerModule(createFileContentSerializationModule(zipFileWrapper));
    objectMapperCustomizer.customize(objectMapper);
    return objectMapper;
  }

  private static SimpleModule createFileContentSerializationModule(ZipFileWrapper zipFileWrapper) {
    return new SimpleModule()
        .addSerializer(
            new FileContentSerializer(
                zipFileWrapper::addEntry, zipFileWrapper::getCollisionFreeFileName));
  }

  private String jsonNodeToCsv(String baseKey, JsonNode node) {
    return switch (node) {
      case ArrayNode arrayNode -> jsonArrayToCsv(baseKey, arrayNode);
      case ObjectNode objectNode -> jsonObjectToCsv(baseKey, objectNode);
      default -> formatAsCsvLine(baseKey, node);
    };
  }

  private String jsonArrayToCsv(String baseKey, ArrayNode arrayNode) {
    return IntStream.range(0, arrayNode.size())
        .mapToObj(i -> jsonNodeToCsv(baseKey + "." + i, arrayNode.get(i)))
        .collect(Collectors.joining(System.lineSeparator()));
  }

  private String jsonObjectToCsv(String baseKey, ObjectNode objectNode) {
    return Streams.of(objectNode.fieldNames())
        .map(fieldName -> jsonNodeToCsv(baseKey + "." + fieldName, objectNode.get(fieldName)))
        .filter(StringUtils::isNotEmpty)
        .collect(Collectors.joining(System.lineSeparator()));
  }

  private String formatAsCsvLine(String key, JsonNode node) {
    return key + "," + formatAsCsvValue(node);
  }

  private String formatAsCsvValue(JsonNode node) {
    if (node.isTextual()) {
      return node.asText().replace("\n", "\\n");
    } else {
      return node.asText();
    }
  }

  private static JsonNode toJsonNode(EntityWithExternalId entity, ObjectMapper objectMapper) {
    try {
      // Workaround for https://github.com/FasterXML/jackson-databind/issues/2140
      // Cannot simply do: return objectMapper.valueToTree(entity);
      // Must instead write once to String and then to JsonNode.
      return objectMapper.readTree(objectMapper.writeValueAsString(entity));
    } catch (JsonProcessingException e) {
      throw new UncheckedIOException(
          "Error during serializing object of type " + entity.getClass().getTypeName() + " as json",
          e);
    }
  }

  @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
  private interface GenericEntityMixin {}
}
