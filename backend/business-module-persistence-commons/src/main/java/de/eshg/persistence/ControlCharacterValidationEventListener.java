/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import de.cronn.reflection.util.PropertyUtils;
import java.beans.PropertyDescriptor;
import org.hibernate.event.spi.*;

public class ControlCharacterValidationEventListener
    implements PreInsertEventListener, PreUpdateEventListener {

  @Override
  public boolean onPreInsert(PreInsertEvent event) {
    return validateEntity(event);
  }

  @Override
  public boolean onPreUpdate(PreUpdateEvent event) {
    return validateEntity(event);
  }

  private boolean validateEntity(AbstractPreDatabaseOperationEvent event) {
    Object entity = event.getEntity();
    Object primaryKey = event.getId();

    for (PropertyDescriptor propertyDescriptor : PropertyUtils.getPropertyDescriptors(entity)) {
      if (propertyDescriptor.getPropertyType().equals(String.class)) {
        String value = PropertyUtils.read(entity, propertyDescriptor);
        if (containsDisallowedControlCharacters(value)) {
          String qualifiedPropertyName =
              PropertyUtils.getQualifiedPropertyName(entity, propertyDescriptor);
          throw new IllegalArgumentException(
              "Disallowed control character in %s with primary key %s."
                  .formatted(qualifiedPropertyName, primaryKey));
        }
      }
    }

    return false;
  }

  private static boolean containsDisallowedControlCharacters(String value) {
    if (value == null) {
      return false;
    }

    for (int i = 0; i < value.length(); i++) {
      char c = value.charAt(i);

      // Allow newline (\n), tab (\t), and carriage return (\r)
      if (c == '\n' || c == '\t' || c == '\r') {
        continue;
      }

      // save to use since control characters do not exist in the supplementary character ranges
      if (Character.isISOControl(c)) {
        return true;
      }
    }
    return false;
  }
}
