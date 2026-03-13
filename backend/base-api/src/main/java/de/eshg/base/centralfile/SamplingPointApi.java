/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateRequest;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointsResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesRequest;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesResponse;
import de.eshg.base.centralfile.api.samplingpoint.UpdateReferenceSamplingPointRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = SamplingPointApi.BASE_URL)
public interface SamplingPointApi {
  String BASE_URL = BaseUrls.Base.SAMPLING_POINT_API;
  String FILE_STATES_URL = BaseUrls.Base.SAMPLING_POINT_FILE_STATE_URL;
  String REFERENCE_URL = "/reference";
  String REFERENCE_UPDATE_URL = REFERENCE_URL + "/{id}/update";

  @PostExchange(FILE_STATES_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Add a new sampling point file state and associate it with a reference sampling point.
          If no reference id is provided, an existing reference sampling point with matching sampling point data is selected or (if
          it does not exist) created for this purpose.
          """)
  AddSamplingPointFileStateResponse addSamplingPointFileState(
      @RequestBody @Valid AddSamplingPointFileStateRequest request);

  @GetExchange(FILE_STATES_URL + "/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a sampling point")
  GetSamplingPointFileStateResponse getSamplingPointFileState(
      @PathVariable("id") @Parameter(description = "The Id of the File State of the SamplingPoint.")
          UUID id);

  @GetExchange(FILE_STATES_URL + "/{id}/reference-sampling-point")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Get the reference data of a sampling point identified by an id.
          Caution: The returned id of the reference sampling point must not be stored.
          """)
  GetReferenceSamplingPointResponse getReferenceSamplingPoint(
      @PathVariable("id")
          @Parameter(
              description =
                  "The external id, either of the reference data, or an existing File State of the SamplingPoint.")
          UUID id);

  @GetExchange(FILE_STATES_URL + REFERENCE_URL + "/get-all")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Get all reference sampling points, optionally matching the given namePrefix.
      Caution: The returned id of the reference sampling point must not be stored.
      """)
  GetReferenceSamplingPointsResponse getAllReferenceSamplingPoints(
      @Parameter(description = "A prefix of the sampling point name to be searched for")
          @RequestParam(value = "namePrefix", required = false)
          String namePrefix);

  @GetExchange(FILE_STATES_URL + REFERENCE_URL + "/{facilityId}")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Get the data of the reference sampling point associated with a given facility file state.
  Caution: The returned id of the reference sampling point must not be stored.
  """)
  GetReferenceSamplingPointsResponse getReferenceSamplingPointsByFacilityFileStateId(
      @PathVariable("facilityId") @Parameter(description = "The facility id of the SamplingPoint.")
          UUID facilityId,
      @Parameter(description = "A prefix of the sampling points to be searched for")
          @RequestParam(value = "namePrefix", required = false)
          String namePrefix);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Search reference sampling pointFileStates for the given knowledge factor 'name'.
  Excludes sampling pointFileStates created from external sources.
  Caution: The returned ids of the reference sampling pointFileStates must not be stored.
  """)
  GetSamplingPointFileStatesResponse searchReferenceSamplingPoints(
      @Parameter(
              description =
                  "Left-truncated part of the SamplingPoint's ZID (knowledge factor) which shall be searched for.")
          @RequestParam(value = "zid", required = false)
          String zid);

  @GetExchange(FILE_STATES_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Get the Ids of all other sampling point file states associated
      with the reference sampling point of the given file state.
      Think of the result being the list of siblings of the provided file state.
      """)
  GetFileStateIdsResponse getSiblingFileStateIds(
      @PathVariable("id") @Parameter(description = "The Id of the File State of the Facility.")
          UUID id);

  @GetExchange(REFERENCE_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
     Get the Ids of all sampling point file states associated with the given reference.
     Think of the result being all child file states for the provided reference""")
  GetFileStateIdsResponse getChildFacilityFileStateIds(
      @PathVariable("id") @Parameter(description = "The Id of the Reference sampling point.")
          UUID referenceId);

  @PostExchange(FILE_STATES_URL + "/bulk-get")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get multiple sampling point fileStates")
  GetSamplingPointFileStatesResponse getSamplingPointFileStates(
      @Valid @RequestBody GetSamplingPointFileStatesRequest request);

  @PostExchange(REFERENCE_UPDATE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
"""
Updates reference sampling point data identified by given id. Sets dataOrigin to DataOrigin.EDIT.
Returns a new file state with the resulting new state.
""")
  AddSamplingPointFileStateResponse updateReferenceSamplingPoint(
      @PathVariable("id") UUID referenceDataId,
      @RequestBody @Valid UpdateReferenceSamplingPointRequest request);
}
