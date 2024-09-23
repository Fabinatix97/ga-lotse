/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.openapi;

import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.Annotated;
import com.fasterxml.jackson.databind.introspect.AnnotatedClass;
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector;
import com.fasterxml.jackson.databind.jsontype.NamedType;
import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

/**
 * Resolve subtypes from the objectMapper and its subtypeResolver instead of processing only
 * annotations
 *
 * <p>Workaround for <a
 * href=https://github.com/swagger-api/swagger-core/issues/4225>swagger-core#4225<a/>
 */
public class RegisteredSubtypeAwareJacksonAnnotationIntrospector
    extends JacksonAnnotationIntrospector {

  @Serial private static final long serialVersionUID = 1L;

  private final ObjectMapper objectMapper;

  public RegisteredSubtypeAwareJacksonAnnotationIntrospector(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public List<NamedType> findSubtypes(Annotated annotated) {
    List<NamedType> subtypesByAnnotation = super.findSubtypes(annotated);
    if (!(annotated instanceof AnnotatedClass annotatedClass)) {
      return subtypesByAnnotation;
    }

    Set<NamedType> subtypes = new LinkedHashSet<>(getDirectSubtypes(annotatedClass));
    if (subtypes.isEmpty()) {
      return subtypesByAnnotation;
    }

    /*
    `subtypes` contains only direct subtypes which is verified by reflection.
    Thus, explicitly declared subtypes using @JsonSubtypes are potentially removed.
    Add back subtypes by @JsonSubtypes to not change any behavior.
    */
    subtypes.addAll(Optional.ofNullable(subtypesByAnnotation).orElseGet(Collections::emptyList));

    // Needs to be modifiable
    return new ArrayList<>(subtypes);
  }

  private List<NamedType> getDirectSubtypes(AnnotatedClass annotatedClass) {
    /*
    Swagger only expects direct subtypes, but jackson returns also indirect
    => Filter indirect subtypes out
    */
    Class<?> potentialSuperType = annotatedClass.getRawType();
    return getSubtypes(annotatedClass).stream()
        .filter(namedType -> isDirectSubtype(namedType.getType(), potentialSuperType))
        .toList();
  }

  private Collection<NamedType> getSubtypes(AnnotatedClass annotatedClass) {
    // Avoid recursion during resolving
    DeserializationConfig config =
        objectMapper.getDeserializationConfig().with(new JacksonAnnotationIntrospector());

    return objectMapper
        .getSubtypeResolver()
        .collectAndResolveSubtypesByClass(config, annotatedClass);
  }

  private boolean isDirectSubtype(Class<?> potentialSubType, Class<?> potentialSuperType) {
    Stream<Class<?>> directSuperTypes =
        Stream.concat(
            Stream.of(potentialSubType.getInterfaces()),
            Stream.of(potentialSubType.getSuperclass()));
    return directSuperTypes.anyMatch(potentialSuperType::equals);
  }
}
