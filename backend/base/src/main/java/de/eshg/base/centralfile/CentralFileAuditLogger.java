/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.persistence.entity.DataOrigin;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.Map;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

@Component
public class CentralFileAuditLogger {
  private static final String KEY_USER = "durch Benutzer";
  private static final String KEY_ID = "ID";
  private static final String KEY_REFERENCE_ID = "StammdatenID";

  private final AuditLogger auditLogger;

  public CentralFileAuditLogger(AuditLogger auditLogger) {
    this.auditLogger = auditLogger;
  }

  public void logAddReferenceData(CentralFileData referenceData) {
    auditLogger.log(
        getCategory(referenceData),
        "Anlegen Stammdaten (%s)".formatted(toLogString(referenceData.getDataOrigin())),
        Map.of(
            KEY_ID,
            referenceData.getExternalId().toString(),
            KEY_USER,
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
  }

  private static String getCategory(CentralFileData referenceData) {
    String centralFileType = Hibernate.getClass(referenceData).getSimpleName();
    return "Zentralkartei %s".formatted(centralFileType);
  }

  private static String toLogString(DataOrigin dataOrigin) {
    return String.valueOf(dataOrigin);
  }

  public void logAddFileState(CentralFileData fileState) {
    auditLogger.log(
        getCategory(fileState),
        "Anlegen Sachstand (%s)".formatted(toLogString(fileState.getDataOrigin())),
        Map.of(
            KEY_ID,
            fileState.getExternalId().toString(),
            KEY_REFERENCE_ID,
            fileState.getReferenceData().getExternalId().toString(),
            KEY_USER,
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
  }

  public void logDeleteFileState(CentralFileData fileState) {
    auditLogger.log(
        getCategory(fileState),
        "Markieren zur Löschung Sachstand",
        Map.of(
            KEY_ID,
            fileState.getExternalId().toString(),
            KEY_REFERENCE_ID,
            fileState.getReferenceData().getExternalId().toString(),
            "Löschzeitpunkt",
            String.valueOf(fileState.getDeleteAt()),
            KEY_USER,
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
  }

  public void logDeleteReferenceData(CentralFileData referenceData) {
    auditLogger.log(
        getCategory(referenceData),
        "Markieren zur Löschung Stammdaten",
        Map.of(
            KEY_ID,
            referenceData.getExternalId().toString(),
            "Löschzeitpunkt",
            String.valueOf(referenceData.getDeleteAt()),
            KEY_USER,
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
  }

  public void logEditReferenceData(CentralFileData referenceData) {
    auditLogger.log(
        getCategory(referenceData),
        "Editieren Stammdaten",
        Map.of(
            KEY_ID,
            referenceData.getExternalId().toString(),
            KEY_USER,
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-")));
  }
}
