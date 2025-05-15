/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config;

import static de.cronn.commons.lang.StreamUtil.toLinkedHashMap;
import static de.eshg.base.util.CollectionUtils.union;

import de.eshg.lib.auditlog.AuditLogger;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.SequencedMap;
import org.springframework.stereotype.Component;

@Component
public class AuditLogWriter {

  private final AuditLogger auditLogger;

  public AuditLogWriter(AuditLogger auditLogger) {
    this.auditLogger = auditLogger;
  }

  public void writeChangeToAuditlog(
      String prefix,
      SequencedMap<String, String> persistentFields,
      SequencedMap<String, String> updateFields) {
    auditLogger.log(
        "Konfiguration",
        "Änderung",
        getDiff(prefix, nullToEmpty(persistentFields), nullToEmpty(updateFields)));
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

  private static SequencedMap<String, String> nullToEmpty(SequencedMap<String, String> map) {
    if (map == null) {
      return new LinkedHashMap<>();
    } else {
      return map;
    }
  }
}
