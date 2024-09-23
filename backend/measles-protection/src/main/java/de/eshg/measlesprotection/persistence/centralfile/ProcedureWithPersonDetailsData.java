/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import java.util.List;

public record ProcedureWithPersonDetailsData(
    MeaslesProtectionProcedure procedure,
    AddPersonFileStateResponse personDetails,
    List<AddPersonFileStateResponse> custodianDetails) {}
