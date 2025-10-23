/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.schoolentry.api.pdf.Address;

public record InvitationData(
    DepartmentLogo departmentLogo,
    Address office,
    Address child,
    Address custodian,
    String personId,
    InvitationExamination examination,
    InvitationInfo invitationInfo,
    String accentColorHex,
    String qrBoxBackgroundColorHex) {}
