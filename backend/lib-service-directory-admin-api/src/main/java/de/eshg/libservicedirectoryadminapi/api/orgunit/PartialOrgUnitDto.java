/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.orgunit;

import de.eshg.lib.common.FederalState;
import de.eshg.libservicedirectoryadminapi.api.staging.StagingStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(name = "AdminPartialOrgUnit")
public record PartialOrgUnitDto(
    UUID id,
    String readableName,
    Boolean active,
    OrgUnitTypeDto type,
    FederalState federalState,
    StagingStatusDto stagingStatus) {}
