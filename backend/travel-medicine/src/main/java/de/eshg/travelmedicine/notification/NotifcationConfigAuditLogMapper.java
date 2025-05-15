/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.travelmedicine.notification.persistence.entity.NotificationConfig;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class NotifcationConfigAuditLogMapper {

  private NotifcationConfigAuditLogMapper() {}

  static SequencedMap<String, String> getRelevantFieldsForLogging(NotificationConfig config) {
    LinkedHashMap<String, String> relevantFields = new LinkedHashMap<>();
    relevantFields.put("greeting", config.getGreeting());
    relevantFields.put("fromAddress", config.getFromAddress());
    return relevantFields;
  }
}
