/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.openapi;

import static java.util.function.Predicate.not;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedClass;
import com.fasterxml.jackson.databind.jsontype.NamedType;
import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.core.converter.ModelConverter;
import io.swagger.v3.core.converter.ModelConverterContext;
import io.swagger.v3.core.util.AnnotationsUtils;
import io.swagger.v3.oas.models.media.Schema;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springdoc.core.converters.PolymorphicModelConverter;
import org.springdoc.core.providers.ObjectMapperProvider;

/**
 * Extends the org.springdoc.core.converters.PolymorphicModelConverter to generate oneOf properties
 * for indirect subclasses.
 *
 * @see <a href="https://github.com/springdoc/springdoc-openapi/issues/2603">Springdoc issue</a>
 */
public class DeepPolymorphicModelConverter extends PolymorphicModelConverter {

  private final ObjectMapper objectMapper;

  public DeepPolymorphicModelConverter(
      ObjectMapperProvider springDocObjectMapper, ObjectMapper objectMapper) {
    super(springDocObjectMapper);
    this.objectMapper = objectMapper;
  }

  @Override
  @SuppressWarnings("rawtypes")
  public Schema resolve(
      AnnotatedType type, ModelConverterContext context, Iterator<ModelConverter> chain) {
    // Fix for https://github.com/springdoc/springdoc-openapi/issues/2614
    boolean isChildAttribute = type.getParent() != null;
    if (isChildAttribute) {
      type.setResolveAsRef(true);
    }

    Schema<?> resolvedSchema = super.resolve(type, context, chain);
    if (!hasOneOf(resolvedSchema)) {
      return resolvedSchema;
    }
    return addOneOfsForIndirectSubclasses(type, resolvedSchema, context);
  }

  private boolean hasOneOf(Schema<?> resolvedSchema) {
    return resolvedSchema != null
        && resolvedSchema.getOneOf() != null
        && !resolvedSchema.getOneOf().isEmpty();
  }

  private Schema<?> addOneOfsForIndirectSubclasses(
      AnnotatedType annotatedType, Schema<?> resolvedSchema, ModelConverterContext context) {
    List<? extends Class<?>> subtypes = getSubtypes(annotatedType);

    List<? extends Schema<?>> schemasOfAbstractTypes =
        resolveSchemas(filterAbstractSubtypes(subtypes), context);

    Set<Schema<?>> oneOfs = new LinkedHashSet<>();

    resolvedSchema.getOneOf().stream()
        .filter(not(schemasOfAbstractTypes::contains))
        .forEach(oneOfs::add);

    oneOfs.addAll(
        resolveSchemas(subtypes.stream().filter(not(this::isAbstract)).toList(), context));

    return resolvedSchema.oneOf(new ArrayList<>(oneOfs));
  }

  private List<? extends Class<?>> getSubtypes(AnnotatedType annotatedType) {
    SerializationConfig config = objectMapper.getSerializationConfig();
    AnnotatedClass annotatedClass = getAnnotatedClass(annotatedType);

    return objectMapper
        .getSubtypeResolver()
        .collectAndResolveSubtypesByClass(config, annotatedClass)
        .stream()
        .map(NamedType::getType)
        .filter(not(annotatedClass.getRawType()::equals))
        .toList();
  }

  private AnnotatedClass getAnnotatedClass(AnnotatedType annotatedType) {
    Type type = annotatedType.getType();
    return objectMapper
        .getSerializationConfig()
        .introspect(objectMapper.constructType(type))
        .getClassInfo();
  }

  private List<? extends Schema<?>> resolveSchemas(
      List<? extends Class<?>> subtypes, ModelConverterContext context) {
    return subtypes.stream()
        .map(type -> resolveReferenceSchemaForType(type, context))
        .filter(Objects::nonNull)
        .toList();
  }

  private Schema<?> resolveReferenceSchemaForType(Class<?> type, ModelConverterContext context) {
    AnnotatedType annotatedType = toAnnotatedType(type);
    Schema<?> resolvedSchema = context.resolve(annotatedType);
    return toReferenceSchema(resolvedSchema);
  }

  private AnnotatedType toAnnotatedType(Class<?> type) {
    return new AnnotatedType().type(type);
  }

  private Schema<?> toReferenceSchema(Schema<?> schema) {
    String name = schema.getName();
    if (name == null) {
      return null;
    } else {
      return new Schema<>().$ref(AnnotationsUtils.COMPONENTS_REF + name);
    }
  }

  private List<? extends Class<?>> filterAbstractSubtypes(List<? extends Class<?>> subtypes) {
    return subtypes.stream().filter(this::isAbstract).toList();
  }

  private boolean isAbstract(Class<?> type) {
    return Modifier.isAbstract(type.getModifiers()) || type.isInterface();
  }
}
