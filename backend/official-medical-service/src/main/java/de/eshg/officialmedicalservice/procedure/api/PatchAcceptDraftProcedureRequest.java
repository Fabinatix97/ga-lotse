/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import jakarta.validation.Valid;
import java.util.UUID;

public record PatchAcceptDraftProcedureRequest(
    UUID referencePersonId, @Valid AffectedPersonDto affectedPerson) {}
