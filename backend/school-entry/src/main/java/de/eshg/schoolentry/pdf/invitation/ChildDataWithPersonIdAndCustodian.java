/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.invitation;

import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.schoolentry.business.model.ChildData;

public record ChildDataWithPersonIdAndCustodian(
    ChildData childData, String personId, PersonDetails custodian) {}
