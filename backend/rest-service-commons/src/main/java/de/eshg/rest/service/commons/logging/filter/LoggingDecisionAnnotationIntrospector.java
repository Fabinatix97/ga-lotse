/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging.filter;

import com.fasterxml.jackson.databind.introspect.Annotated;
import com.fasterxml.jackson.databind.introspect.AnnotatedClass;
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector;
import de.eshg.api.commons.CanBeLogged;
import java.io.Serial;
import java.util.UUID;
import org.springframework.beans.BeanUtils;

public class LoggingDecisionAnnotationIntrospector extends JacksonAnnotationIntrospector {

  @Serial private static final long serialVersionUID = 1L;

  @Override
  public Object findSerializer(Annotated annotated) {
    if (shouldBeMasked(annotated)) {
      return new MaskingSerializer();
    }
    return super.findSerializer(annotated);
  }

  private boolean shouldBeMasked(Annotated am) {
    if (am instanceof AnnotatedClass) {
      return false;
    }

    if (!BeanUtils.isSimpleProperty(am.getRawType())) {
      return false;
    }

    if (isAnnotatedWithCanBeLogged(am)) {
      return false;
    }

    return !isUuid(am);
  }

  private boolean isUuid(Annotated am) {
    return UUID.class.isAssignableFrom(am.getRawType());
  }

  private boolean isAnnotatedWithCanBeLogged(Annotated am) {
    return _hasAnnotation(am, CanBeLogged.class);
  }
}
