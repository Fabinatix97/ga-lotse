/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.schoolentry.api.pdf.Address;

public record InvitationExamination(
    String executionDate,
    String executionTime,
    String qrCode,
    String accessCode,
    Address executionLocation) {}
