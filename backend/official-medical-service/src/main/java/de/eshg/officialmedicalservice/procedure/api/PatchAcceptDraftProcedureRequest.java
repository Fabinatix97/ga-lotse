/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import jakarta.validation.Valid;
import java.util.UUID;

public record PatchAcceptDraftProcedureRequest(
    UUID referencePersonId, @Valid AffectedPersonDto affectedPerson) {}
