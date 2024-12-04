/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.dental.api.ProphylaxisTypeDto;
import java.util.UUID;

public record ProphylaxisSessionFilterParameters(
    UUID institutionIdFilter, ProphylaxisTypeDto typeFilter) {}
