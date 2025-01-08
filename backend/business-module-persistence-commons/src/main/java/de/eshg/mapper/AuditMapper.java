/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mapper;

import de.eshg.domain.model.audit.DefaultRevisionEntity;
import java.util.List;
import java.util.Set;
import org.hibernate.envers.RevisionType;

public final class AuditMapper {
  private AuditMapper() {
    throw new UnsupportedOperationException("Utility class");
  }

  public static <T> List<RevisionEntryWithChange<T>> mapToRevisionEntryWithChangeList(
      Class<T> entityClass, List<?> resultList) {
    return resultList.stream()
        .map(Object[].class::cast)
        .map(array -> mapToRevisionEntryWithChange(entityClass, array))
        .toList();
  }

  public static <T> List<RevisionEntry<T>> mapToRevisionEntryList(
      Class<T> entityClass, List<?> resultList) {
    return resultList.stream()
        .map(Object[].class::cast)
        .map(array -> mapToRevisionEntry(entityClass, array))
        .toList();
  }

  @SuppressWarnings("unchecked")
  public static <T> RevisionEntryWithChange<T> mapToRevisionEntryWithChange(
      Class<T> entityClass, Object[] entry) {
    return new RevisionEntryWithChange<>(
        entityClass.cast(entry[0]),
        (DefaultRevisionEntity) entry[1],
        (RevisionType) entry[2],
        (Set<String>) entry[3]);
  }

  private static <T> RevisionEntry<T> mapToRevisionEntry(Class<T> entityClass, Object[] entry) {
    return new RevisionEntry<>(
        entityClass.cast(entry[0]), (DefaultRevisionEntity) entry[1], (RevisionType) entry[2]);
  }
}
