/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import de.eshg.model.HasResolvableUserIds;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ApprovalRequestEntity")
@JsonTypeInfo(use = Id.NAME, property = "@type")
public interface ApprovalRequestEntityDto extends HasResolvableUserIds {}
