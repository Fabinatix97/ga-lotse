/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.cronn.reflection.util.ClassUtils;
import de.cronn.reflection.util.PropertyUtils;
import java.beans.PropertyDescriptor;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

final class SnapshotUtil {
  private SnapshotUtil() {}

  private static final ObjectMapper objectMapper =
      new ObjectMapper()
          .registerModule(new JavaTimeModule())
          .registerModule(stableCollectionModule())
          .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
          .enable(SerializationFeature.INDENT_OUTPUT);

  private static Module stableCollectionModule() {
    SimpleModule module = new SimpleModule();
    module.addAbstractTypeMapping(Set.class, LinkedHashSet.class);
    module.addAbstractTypeMapping(Map.class, LinkedHashMap.class);
    return module;
  }

  public static <T> String createSnapshot(T obj) {
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }

  public static <T> void restoreSnapshot(String snapshot, T object) {
    try {
      T restoredObject = objectMapper.readValue(snapshot, ClassUtils.getRealClass(object));

      for (PropertyDescriptor propertyDescriptor : PropertyUtils.getPropertyDescriptors(object)) {
        if (PropertyUtils.isFullyAccessible(propertyDescriptor)) {
          PropertyUtils.copyValue(restoredObject, object, propertyDescriptor);
        }
      }
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }
}
