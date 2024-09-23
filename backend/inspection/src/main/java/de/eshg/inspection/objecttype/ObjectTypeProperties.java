/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.inspection.object-types")
public record ObjectTypeProperties(
    List<String> defaultObjectTypes,
    Integer routineInterval,
    Integer complaintInterval,
    Integer standardDuration,
    Integer standardBufferTime) {}
