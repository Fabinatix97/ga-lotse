/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.File;
import java.util.UUID;

public record ProgressEntryReferenceFilePair(UUID progressEntryExternalId, File file) {}
