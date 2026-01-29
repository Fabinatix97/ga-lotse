/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.centralfile;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import java.util.List;

public record ProcedureWithPersonDetailsData(
    MeaslesProtectionProcedure procedure,
    GetPersonFileStateResponse personDetails,
    List<GetPersonFileStateResponse> custodianDetails,
    List<GetPersonWithoutDateOfBirthResponse> custodianWithoutDateOfBirthDetails) {}
