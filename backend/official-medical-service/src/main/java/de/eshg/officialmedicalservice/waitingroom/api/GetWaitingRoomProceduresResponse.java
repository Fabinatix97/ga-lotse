/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom.api;

import de.eshg.base.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetWaitingRoomProceduresResponse")
public record GetWaitingRoomProceduresResponse(
    @Valid @NotNull List<WaitingRoomProcedureDto> elements, @NotNull long totalNumberOfElements)
    implements PagedResponse<WaitingRoomProcedureDto> {}
