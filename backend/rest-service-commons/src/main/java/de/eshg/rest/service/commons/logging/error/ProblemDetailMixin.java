/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging.error;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;

import com.fasterxml.jackson.annotation.JsonInclude;
import de.eshg.api.commons.CanBeLogged;
import java.net.URI;
import java.util.Map;
import org.springframework.http.converter.json.ProblemDetailJacksonMixin;

@JsonInclude(NON_EMPTY)
public interface ProblemDetailMixin extends ProblemDetailJacksonMixin {

  @CanBeLogged
  URI getType();

  @CanBeLogged
  String getTitle();

  @CanBeLogged
  int getStatus();

  @CanBeLogged
  String getDetail();

  @CanBeLogged
  URI getInstance();

  @Override
  @CanBeLogged
  Map<String, Object> getProperties();
}
