/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.domain.model.serialization.ZipFileWrapper;
import de.eshg.lib.procedure.domain.model.FileContent_;
import de.eshg.lib.procedure.domain.model.File_;
import de.eshg.lib.procedure.domain.model.Mail_;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry_;
import de.eshg.lib.procedure.domain.model.MetaData_;
import de.eshg.lib.procedure.domain.model.Procedure_;
import de.eshg.lib.procedure.domain.model.ProcessedInboxProgressEntry_;
import de.eshg.lib.procedure.domain.model.ProgressEntry_;
import de.eshg.lib.procedure.domain.model.RelatedFacility_;
import de.eshg.lib.procedure.domain.model.RelatedPerson_;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry_;
import de.eshg.lib.procedure.domain.model.Task_;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Stream.Builder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.Resource;

public abstract class AbstractGdprZipEditorProvider {

  private final Resource resource;

  public static final String FILE_META_DATA = "metaData";

  protected AbstractGdprZipEditorProvider(Resource resource) {
    this.resource = resource;
  }

  protected abstract ZipEditor createSpecificFilter();

  protected String getLegalBasis() {
    try {
      return Files.readString(resource.getFile().toPath());
    } catch (IOException e) {
      throw new UncheckedIOException("Could not read resource file " + resource.getFilename(), e);
    }
  }

  public ZipEditor create(List<UUID> fileStateIds) {
    return createCommonFilter(fileStateIds)
        .andThen(createSpecificFilter())
        .andThen(createLegalBasisEnricher());
  }

  private ZipEditor createLegalBasisEnricher() {
    return (jsonNode, zipFileWrapper) -> {
      if (!zipFileWrapper.getFileNames().contains("Rechtsgrundlage.txt")) {
        zipFileWrapper.addEntry("Rechtsgrundlage.txt", getLegalBasis().getBytes());
      }
    };
  }

  private static ZipEditor createCommonFilter(List<UUID> fileStateIds) {
    List<String> fileStateIdStrings = fileStateIds.stream().map(UUID::toString).toList();
    return removeManualAndProcessedInboxProgressEntries()
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
        .andThen(
            removeFieldFromArray(
                File_.DELETION_APPROVAL_REQUEST, Procedure_.PROGRESS_ENTRIES, ProgressEntry_.FILE))
        .andThen(
            removeFieldFromArray(
                MetaData_.DESCRIPTION,
                Procedure_.PROGRESS_ENTRIES,
                ProgressEntry_.FILE,
                FILE_META_DATA))
        .andThen(removeFieldFromArray(Task_.CURRENT_ASSIGNMENT, Procedure_.TASKS))
        .andThen(removeFieldFromArray(Task_.ASSIGNMENT_HISTORY, Procedure_.TASKS))
        .andThen(removeFieldFromArray(Task_.NOTIFICATIONS, Procedure_.TASKS));
  }

  protected static ZipEditor removeManualAndProcessedInboxProgressEntries() {
    return (procedureNode, zipFile) -> {
      ArrayNode arrayNode = procedureNode.withArray(Procedure_.PROGRESS_ENTRIES);
      for (Iterator<JsonNode> array = arrayNode.elements(); array.hasNext(); ) {
        JsonNode element = array.next();
        removeManualAndProcessedInboxProgressEntry(element, array, zipFile);
      }
    };
  }

  private static void removeManualAndProcessedInboxProgressEntry(
      JsonNode element, Iterator<JsonNode> array, ZipFileWrapper zipFile) {
    if (isManualOrProcessedInboxProgressEntry(element)) {
      removeFileIfNonNull(zipFile, element);
      array.remove();
    }
  }

  private static void removeFileIfNonNull(ZipFileWrapper zipFile, JsonNode progressEntryNode) {
    getFileNames(progressEntryNode).forEach(zipFile::removeEntry);
  }

  private static boolean isManualOrProcessedInboxProgressEntry(JsonNode element) {
    return manualProgressEntryTypeIsSet(element) || systemProgressEntryTypeIsSet(element);
  }

  private static boolean manualProgressEntryTypeIsSet(JsonNode element) {
    return isSet(element.get(ManualProgressEntry_.MANUAL_PROGRESS_ENTRY_TYPE));
  }

  private static boolean systemProgressEntryTypeIsSet(JsonNode element) {
    return isSet(element.get(ProcessedInboxProgressEntry_.INBOX_PROGRESS_ENTRY_TYPE));
  }

  private static boolean isSet(JsonNode field) {
    return !StringUtils.equals(null, getTextOrNull(field));
  }

  protected static ZipEditor removeArrayEntriesWithoutValues(
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
      removeFileIfNonNull(zipFile, element);
    }
  }

  protected static ZipEditor removeArrayEntriesWithValues(
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
      removeFileIfNonNull(zipFile, element);
    }
  }

  protected static ZipEditor removeFieldFromArray(
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

  protected static ZipEditor removeFieldFromPath(String fieldName, String... nestedFieldNames) {
    return (jsonNode, zipFileWrapper) -> {
      JsonNode element = moveThroughNestedFields(nestedFieldNames, jsonNode);
      ((ObjectNode) element).remove(fieldName);
    };
  }

  private static List<String> getFileNames(JsonNode progressEntry) {
    JsonNode file = progressEntry.get(ProgressEntry_.FILE);

    if (file == null || file.isNull()) {
      return Collections.emptyList();
    }

    Builder<JsonNode> files = Stream.builder();
    files.add(file);
    file.withArray(Mail_.ATTACHMENTS).forEach(files::add);

    return files
        .build()
        .map(AbstractGdprZipEditorProvider::getFileName)
        .filter(Objects::nonNull)
        .toList();
  }

  private static String getFileName(JsonNode file) {
    return file.get(File_.FILE_CONTENT).get(FileContent_.CONTENT).asText();
  }

  private static String getTextOrNull(JsonNode element) {
    return element == null ? null : element.asText();
  }
}
