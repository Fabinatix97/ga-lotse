/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
public sealed interface ConcreteFileOrFileReference
    permits ConcreteFileDto, GenericFileReferenceDto {

  UUID getFileId();

  boolean isDeleted();

  boolean isDeletable();
}
