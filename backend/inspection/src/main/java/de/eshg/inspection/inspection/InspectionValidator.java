/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static java.util.Comparator.nullsLast;

import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.common.persistence.HashAlgorithm;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.report.persistence.InspectionSignature;
import de.eshg.inspection.util.HashUtil;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.rest.service.error.BadRequestException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InspectionValidator {

  private static final Logger log = LoggerFactory.getLogger(InspectionValidator.class);
  private static final String HASH_KEY_CHECKLIST = "checklist";
  private static final String HASH_KEY_SECTION = "section";
  private static final String HASH_KEY_ELEMENT = "element";

  private static final String ENTITY_DELIMITER = "&&&";
  private static final String ENTITY_VALUES_DELIMITER = "@@@";
  private static final String FIELD_DELIMITER = ":::";

  @Value("${de.eshg.inspection.hash-algorithm}")
  private HashAlgorithm hashAlgorithm;

  public void generateSignatureHash(
      InspectionSignature signature, InspectionPhase inspectionPhase) {
    verifyInspectionPhase(inspectionPhase);

    if (signature != null) {
      Long signatureId = signature.getId();
      try (InputStream stringInputStream =
              new ByteArrayInputStream(
                  ("%s;%s;".formatted(signatureId, signature.getSigner()))
                      .getBytes(StandardCharsets.UTF_8));
          InputStream combinedInputStream =
              new SequenceInputStream(
                  stringInputStream,
                  new ByteArrayInputStream(
                      signature.getSignatureImage().getFileContent().getAllBytes()))) {
        String signatureHash = HashUtil.hash(combinedInputStream, hashAlgorithm);
        signature.setHashAlgorithm(hashAlgorithm);
        signature.setHashValue(signatureHash);
      } catch (IOException exception) {
        log.error("Failed to create hash for signature", exception);
      }
    }
  }

  public void generateChecklistHashes(List<Checklist> checklists, InspectionPhase inspectionPhase) {
    verifyInspectionPhase(inspectionPhase);
    checklists.forEach(
        checklist -> {
          Map<String, List<String>> fieldsToHash = getFieldsToHash(checklist);
          String valuesToHash = convertChecklistForHash(checklist, fieldsToHash);
          String checklistHash = HashUtil.hash(valuesToHash, hashAlgorithm);
          checklist.setHashedFields(serializeFieldsToHash(fieldsToHash));
          checklist.setHashAlgorithm(hashAlgorithm);
          checklist.setHashValue(checklistHash);
        });
  }

  private static void verifyInspectionPhase(InspectionPhase inspectionPhase) {
    if (inspectionPhase != InspectionPhase.EXECUTED
        && inspectionPhase != InspectionPhase.CREATING_REPORT_AND_INVOICE
        && inspectionPhase != InspectionPhase.CLOSED) {
      throw new BadRequestException(
          "wrong phase; inspection must be at least %s; actual: %s"
              .formatted(InspectionPhase.EXECUTED, inspectionPhase));
    }
  }

  public static boolean verifySignature(Inspection inspection, InspectionSignature signature) {
    if (executionTaskClosed(inspection) && signature != null) {
      Long signatureId = signature.getId();
      try (InputStream stringInputStream =
              new ByteArrayInputStream(
                  ("%s;%s;".formatted(signatureId, signature.getSigner()))
                      .getBytes(StandardCharsets.UTF_8));
          InputStream combinedInputStream =
              new SequenceInputStream(
                  stringInputStream,
                  signature.getSignatureImage().getFileContent().getFile().getBinaryStream())) {
        return HashUtil.verify(
            combinedInputStream, signature.getHashValue(), signature.getHashAlgorithm());
      } catch (IOException | SQLException e) {
        log.error("Failed to create hash for signature", e);
        return false;
      }
    } else {
      return true;
    }
  }

  public static boolean verifyChecklists(Inspection inspection, List<Checklist> checklists) {
    return checklists.stream().allMatch(checklist -> verifyChecklist(inspection, checklist));
  }

  private static boolean verifyChecklist(Inspection inspection, Checklist checklist) {
    if (executionTaskClosed(inspection) && checklist.getHashValue() != null) {
      try {
        Map<String, List<String>> fieldsToHash =
            deserializeFieldsToHash(checklist.getHashedFields());
        String valuesToHash = convertChecklistForHash(checklist, fieldsToHash);
        return HashUtil.verify(
            valuesToHash, checklist.getHashValue(), checklist.getHashAlgorithm());
      } catch (IllegalStateException exception) {
        log.error("Failed to create hash for checklist {}", checklist.getExternalId(), exception);
        return false;
      }
    } else {
      return true;
    }
  }

  private static String serializeFieldsToHash(Map<String, List<String>> map) {
    return map.entrySet().stream()
        .map(
            entry ->
                entry.getKey()
                    + ENTITY_VALUES_DELIMITER
                    + String.join(FIELD_DELIMITER, entry.getValue()))
        .collect(Collectors.joining(ENTITY_DELIMITER));
  }

  private static Map<String, List<String>> deserializeFieldsToHash(String fieldsToHash) {
    Map<String, List<String>> result = new HashMap<>();

    String[] entities = fieldsToHash.split(ENTITY_DELIMITER);
    for (String entity : entities) {
      String[] entityValuePair = entity.split(ENTITY_VALUES_DELIMITER);
      if (entityValuePair.length == 2) {
        String entityName = entityValuePair[0];
        List<String> fieldValues = Arrays.asList(entityValuePair[1].split(FIELD_DELIMITER));
        result.put(entityName, fieldValues);
      } else {
        throw new IllegalStateException(
            "Deserialization of hashedFields failed. entityValuePair had size %s"
                .formatted(entityValuePair.length));
      }
    }
    if (result.isEmpty()) {
      throw new IllegalStateException("HashedFields is empty after deserialization.");
    }
    return result;
  }

  public static Map<String, List<String>> getFieldsToHash(Checklist checklist) {
    Map<String, List<String>> fieldsToHash = new HashMap<>();
    if (checklist != null && StringUtils.isNotBlank(checklist.getHashedFields())) {
      fieldsToHash.putAll(deserializeFieldsToHash(checklist.getHashedFields()));
    }
    if (fieldsToHash.isEmpty()) {
      fieldsToHash.put(HASH_KEY_CHECKLIST, Checklist.fieldsToHash());
      fieldsToHash.put(HASH_KEY_SECTION, ChecklistSection.fieldsToHash());
      fieldsToHash.put(HASH_KEY_ELEMENT, ChecklistElement.fieldsToHash());
    }
    return fieldsToHash;
  }

  public static String convertChecklistForHash(
      Checklist checklist, Map<String, List<String>> fieldsToHash) {
    List<String> valuesToHash = new ArrayList<>();

    addChecklistForHash(checklist, fieldsToHash, valuesToHash);
    addSectionForHash(checklist, fieldsToHash, valuesToHash);

    valuesToHash.sort(nullsLast(String::compareTo));
    return String.join(";", valuesToHash);
  }

  private static void addChecklistForHash(
      Checklist checklist, Map<String, List<String>> fieldsToHash, List<String> valuesToHash) {
    List<String> checklistKeys = fieldsToHash.get(HASH_KEY_CHECKLIST);
    checklistKeys.forEach(checklistKey -> valuesToHash.add(checklist.getValueForKey(checklistKey)));
  }

  private static void addSectionForHash(
      Checklist checklist, Map<String, List<String>> fieldsToHash, List<String> valuesToHash) {
    for (ChecklistSection section : checklist.getSections()) {
      List<String> sectionKeys = fieldsToHash.get(HASH_KEY_SECTION);
      sectionKeys.forEach(cldVersionKey -> valuesToHash.add(section.getValueForKey(cldVersionKey)));
      addElementForHash(fieldsToHash, valuesToHash, section);
    }
  }

  private static void addElementForHash(
      Map<String, List<String>> fieldsToHash, List<String> valuesToHash, ChecklistSection section) {
    for (ChecklistElement element : section.getElements()) {
      List<String> elementKeys = fieldsToHash.get(HASH_KEY_ELEMENT);
      elementKeys.forEach(
          cldVersionKey -> {
            try {
              valuesToHash.add(element.getValueForKey(cldVersionKey));
            } catch (IllegalStateException ignored) {
              log.debug("Ignoring checklist element for type {}", element.getType());
            }
          });
    }
  }

  private static boolean executionTaskClosed(Inspection inspection) {
    return inspection.getExecutionTask().isPresent()
        && inspection.getExecutionTask().get().getTaskStatus() == TaskStatus.CLOSED;
  }
}
