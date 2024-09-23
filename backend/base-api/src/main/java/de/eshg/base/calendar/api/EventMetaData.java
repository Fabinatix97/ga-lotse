/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.calendar.api;

import de.eshg.lib.common.BusinessModule;
import java.util.UUID;

public record EventMetaData(
    String subject,
    String description,
    String location,
    UUID procedureId,
    BusinessModule businessModule) {}
