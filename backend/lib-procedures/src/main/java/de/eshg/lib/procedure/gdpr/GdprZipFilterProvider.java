/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.eshg.domain.model.serialization.ZipFileWrapper;
import de.eshg.domain.model.serialization.ZipFilter;
import de.eshg.lib.procedure.domain.model.FileContent_;
import de.eshg.lib.procedure.domain.model.File_;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry_;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.RelatedFacility_;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry_;
import de.eshg.lib.procedure.domain.model.Task_;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(GdprZipFilterProvider.class)
public class GdprZipFilterProvider {

  public ZipFilter create(List<UUID> fileStateIds) {
    return createCommonFilter(fileStateIds).andThen(createSpecificFilter());
  }

  protected ZipFilter createSpecificFilter() {
    return (jsonNode, zipFileWrapper) -> {};
  }

  private static ZipFilter createCommonFilter(List<UUID> fileStateIds) {
    List<String> fileStateIdStrings = fileStateIds.stream().map(UUID::toString).toList();
    return removeManualProgressEntries()
        .andThen(
            removeArrayEntriesWithoutValues(
                Procedure_.RELATED_PERSONS,
                RelatedPerson_.CENTRAL_FILE_STATE_ID,
                fileStateIdStrings))
        .andThen(
            removeArrayEntriesWithoutValues(
                Procedure_.RELATED_FACILITIES,
                RelatedFacility_.CENTRAL_FILE_STATE_ID,
                fileStateIdStrings))
        .andThen(
            removeFieldFromArray(SystemProgressEntry_.TRIGGERED_BY, Procedure_.PROGRESS_ENTRIES))
        .andThen(
            removeFieldFromArray(
                File_.CREATED_BY, Procedure_.PROGRESS_ENTRIES, ProgressEntry_.FILE))
        .andThen(removeFieldFromArray(Task_.CURRENT_ASSIGNMENT, Procedure_.TASKS))
        .andThen(
            removeFieldFromArray(SystemProgressEntry_.TRIGGERED_BY, Procedure_.PROGRESS_ENTRIES));
  }

  protected static ZipFilter removeManualProgressEntries() {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(Procedure_.PROGRESS_ENTRIES);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        JsonNode element = array.next();
        removeManualProgressEntry(element, array, zipFile);
      }
    };
  }

  private static void removeManualProgressEntry(
      JsonNode element, Iterator<JsonNode> array, ZipFileWrapper zipFile) {
    String fileName = getFileName(element);
    if (isManualProgressEntry(element)) {
      removeFileIfNonNull(zipFile, fileName);
      array.remove();
    }
  }

  private static void removeFileIfNonNull(ZipFileWrapper zipFile, String fileName) {
    if (fileName != null) {
      zipFile.removeEntry(fileName);
    }
  }

  private static boolean isManualProgressEntry(JsonNode element) {
    return !StringUtils.equals(
        null, getTextOrNull(element.get(ManualProgressEntry_.MANUAL_PROGRESS_ENTRY_TYPE)));
  }

  protected static ZipFilter removeArrayEntriesWithoutValues(
      String arrayFieldName, String fieldName, List<String> filterValues) {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(arrayFieldName);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        JsonNode element = array.next();
        removeArrayEntryNotIn(fieldName, filterValues, element, array, zipFile);
      }
    };
  }

  private static void removeArrayEntryNotIn(
      String fieldName,
      List<String> filterValues,
      JsonNode element,
      Iterator<JsonNode> array,
      ZipFileWrapper zipFile) {
    String fieldValue = getTextOrNull(element.get(fieldName));
    if (filterValues.stream()
        .noneMatch(filterValue -> StringUtils.equals(filterValue, fieldValue))) {
      array.remove();
      removeFileIfNonNull(zipFile, getFileName(element));
    }
  }

  protected static ZipFilter removeArrayEntriesWithValues(
      String arrayFieldName, String fieldName, List<String> filterValues) {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(arrayFieldName);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        JsonNode element = array.next();
        removeArrayEntryIn(fieldName, filterValues, element, array, zipFile);
      }
    };
  }

  private static void removeArrayEntryIn(
      String fieldName,
      List<String> filterValues,
      JsonNode element,
      Iterator<JsonNode> array,
      ZipFileWrapper zipFile) {
    String fieldValue = getTextOrNull(element.get(fieldName));
    if (filterValues.stream()
        .anyMatch(filterValue -> StringUtils.equals(filterValue, fieldValue))) {
      array.remove();
      removeFileIfNonNull(zipFile, getFileName(element));
    }
  }

  protected static ZipFilter removeFieldFromArray(
      String fieldName, String arrayFieldName, String... nestedFieldNames) {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(arrayFieldName);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        JsonNode element = array.next();
        element = moveThroughNestedFields(nestedFieldNames, element);
        ((ObjectNode) element).remove(fieldName);
      }
    };
  }

  private static JsonNode moveThroughNestedFields(String[] nestedFieldNames, JsonNode element) {
    for (String name : nestedFieldNames) {
      JsonNode nested = element.get(name);
      if (nested != null && !nested.isNull()) {
        element = nested;
      }
    }
    return element;
  }

  protected static ZipFilter removeFieldFromPath(String fieldName, String... nestedFieldNames) {
    return (jsonNode, zipFileWrapper) -> {
      JsonNode element = moveThroughNestedFields(nestedFieldNames, jsonNode);
      ((ObjectNode) element).remove(fieldName);
    };
  }

  private static String getFileName(JsonNode element) {
    JsonNode file = element.get(ProgressEntry_.FILE);
    String fileName;
    if (file == null || file.isNull()) {
      fileName = null;
    } else {
      fileName = file.get(File_.FILE_CONTENT).get(FileContent_.CONTENT).asText();
    }
    return fileName;
  }

  private static String getTextOrNull(JsonNode element) {
    return element == null ? null : element.asText();
  }
}
