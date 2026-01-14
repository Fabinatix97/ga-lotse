/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.importer;

import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import jakarta.validation.Path;
import jakarta.validation.constraints.NotNull;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.exception.UncheckedReflectiveOperationException;
import org.hibernate.validator.internal.engine.path.PathImpl;

public class Mapping<A> {
  private final Class<A> rootClass;
  private final List<PropertyDescriptor> propertyDescriptors;

  private Mapping(Class<A> rootClass, List<PropertyDescriptor> propertyDescriptors) {
    this.rootClass = rootClass;
    this.propertyDescriptors = propertyDescriptors;
  }

  public Path getPropertyPath() {
    return PathImpl.createPathFromString(
        propertyDescriptors.stream()
            .map(PropertyDescriptor::getName)
            .collect(Collectors.joining(".")));
  }

  public Class<A> getRootClass() {
    return rootClass;
  }

  public boolean containsClass(Class<?> clazz) {
    return propertyDescriptors.stream()
        .map(PropertyDescriptor::getPropertyType)
        .toList()
        .contains(clazz);
  }

  public Class<?> getFieldClass() {
    return propertyDescriptors.getLast().getPropertyType();
  }

  public Field getField() {
    try {
      PropertyDescriptor child = propertyDescriptors.getLast();
      return child.getReadMethod().getDeclaringClass().getDeclaredField(child.getName());
    } catch (NoSuchFieldException e) {
      throw new UncheckedReflectiveOperationException(e);
    }
  }

  public boolean allAncestorsMandatory() {
    return propertyDescriptors.stream().allMatch(this::isMandatoryProperty);
  }

  private boolean isMandatoryProperty(PropertyDescriptor propertyDescriptor) {
    try {
      Class<?> declaringClass = propertyDescriptor.getReadMethod().getDeclaringClass();
      Field declaredField = declaringClass.getDeclaredField(propertyDescriptor.getName());
      return isMandatory(declaredField);
    } catch (NoSuchFieldException e) {
      throw new UncheckedReflectiveOperationException(e);
    }
  }

  public void write(A target, Object value) {
    write(target, value, propertyDescriptors);
  }

  private boolean isMandatory(Field field) {
    return Arrays.stream(field.getAnnotations()).anyMatch(NotNull.class::isInstance);
  }

  private void write(Object target, Object value, List<PropertyDescriptor> descriptors) {
    if (descriptors.size() == 1) {
      PropertyUtils.write(target, descriptors.getFirst(), value);
    } else {
      write(
          PropertyUtils.read(target, descriptors.getFirst()),
          value,
          descriptors.subList(1, descriptors.size()));
    }
  }

  public static <A> Mapping<A> of(
      Class<A> rootClass, TypedPropertyGetter<A, ?> rootPropertyGetter) {
    return new Mapping<>(
        rootClass, List.of(PropertyUtils.getPropertyDescriptor(rootClass, rootPropertyGetter)));
  }

  public static <A, B> Mapping<A> of(
      Class<A> rootClass,
      TypedPropertyGetter<A, B> rootPropertyGetter,
      Class<B> intermediateClass,
      TypedPropertyGetter<B, ?> intermediatePropertyGetter) {
    return new Mapping<>(
        rootClass,
        Arrays.asList(
            PropertyUtils.getPropertyDescriptor(rootClass, rootPropertyGetter),
            PropertyUtils.getPropertyDescriptor(intermediateClass, intermediatePropertyGetter)));
  }

  public static <A, B, C> Mapping<A> of(
      Class<A> rootClass,
      TypedPropertyGetter<A, B> rootPropertyGetter,
      Class<B> intermediateClass,
      TypedPropertyGetter<B, C> intermediatePropertyGetter,
      Class<C> childClass,
      TypedPropertyGetter<C, ?> childPropertyGetter) {
    return new Mapping<>(
        rootClass,
        Arrays.asList(
            PropertyUtils.getPropertyDescriptor(rootClass, rootPropertyGetter),
            PropertyUtils.getPropertyDescriptor(intermediateClass, intermediatePropertyGetter),
            PropertyUtils.getPropertyDescriptor(childClass, childPropertyGetter)));
  }
}
