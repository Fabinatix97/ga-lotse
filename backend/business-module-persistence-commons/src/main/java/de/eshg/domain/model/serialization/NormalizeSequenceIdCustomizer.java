/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.domain.model.serialization;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.domain.model.GenericEntity;

public class NormalizeSequenceIdCustomizer implements ObjectMapperCustomizer {

  @Override
  public void customize(ObjectMapper objectMapper) {
    objectMapper.addMixIn(GenericEntity.class, NormalizedSequenceIdGenericEntityMixin.class);
  }

  @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "id")
  private interface NormalizedSequenceIdGenericEntityMixin {
    @JsonIgnore
    Number getId();
  }
}
