/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import static de.cronn.commons.lang.StreamUtil.toLinkedHashMap;
import static de.eshg.base.util.CollectionUtils.union;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Component;

@Component
public class AuditLogWriter {

  private final AuditLogger auditLogger;

  public AuditLogWriter(AuditLogger auditLogger) {
    this.auditLogger = auditLogger;
  }

  public void writeChangeToAuditLog(
      String prefix, Map<String, String> persistentFields, Map<String, String> updateFields) {
    writeChangeToAuditLog(prefix, "", persistentFields, updateFields);
  }

  public void writeChangeViaLegacyGUIToAuditLog(
      String prefix, Map<String, String> persistentFields, Map<String, String> updateFields) {
    writeChangeToAuditLog(prefix, " (via legacy GUI)", persistentFields, updateFields);
  }

  private void writeChangeToAuditLog(
      String prefix,
      String functionSuffix,
      Map<String, String> persistentFields,
      Map<String, String> updateFields) {
    auditLogger.log(
        "Konfiguration",
        "Änderung" + functionSuffix,
        additionalData(getDiff(prefix, nullToEmpty(persistentFields), nullToEmpty(updateFields))));
  }

  private static Map<String, String> additionalData(Map<String, String> customFields) {
    LinkedHashMap<String, String> additionalData = new LinkedHashMap<>();
    additionalData.put(
        "User ID", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    additionalData.putAll(customFields);
    return additionalData;
  }

  private static Map<String, String> getDiff(
      String prefix, Map<String, String> persistentData, Map<String, String> entityUpdateData) {
    return union(persistentData.keySet(), entityUpdateData.keySet()).stream()
        .filter(key -> !Objects.equals(persistentData.get(key), entityUpdateData.get(key)))
        .collect(
            toLinkedHashMap(
                key -> prefix + "." + key,
                key -> persistentData.get(key) + " -> " + entityUpdateData.get(key)));
  }

  private static Map<String, String> nullToEmpty(Map<String, String> map) {
    if (map == null) {
      return new LinkedHashMap<>();
    } else {
      return map;
    }
  }
}
