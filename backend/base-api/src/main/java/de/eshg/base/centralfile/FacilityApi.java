/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.*;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = FacilityApi.BASE_URL)
public interface FacilityApi {
  String BASE_URL = BaseUrls.Base.FACILITY_API;
  String FILE_STATES_URL = BaseUrls.Base.FACILITY_FILE_STATE_URL;
  String REFERENCE_URL = "/reference";
  String REFERENCE_UPDATE_URL = REFERENCE_URL + "/{id}/update";

  @PostExchange(FILE_STATES_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Add a new facility file state and associate it with a reference facility.
          If no reference id is provided, an existing reference facility with matching facility data is selected or (if
          it does not exist) created for this purpose.
          If the partial match parameter is provided as true, only the knowledge factors name and address
          (regardless of address addition and different name) are considered for the linking.
          """)
  AddFacilityFileStateResponse addFacilityFileState(
      @RequestBody @Valid AddFacilityFileStateRequest request);

  @GetExchange(FILE_STATES_URL + "/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a facility")
  GetFacilityFileStateResponse getFacilityFileState(
      @Parameter(description = "The Id of the File State of the Facility.") @PathVariable("id")
          UUID id);

  @GetExchange(FILE_STATES_URL + "/{id}/reference-facility")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Get the data of the reference facility associated with a given facility file state.
          Caution: The returned id of the reference facility must not be stored.
          """)
  GetReferenceFacilityResponse getReferenceFacility(
      @Parameter(description = "The Id of the File State of the Facility.")
          @PathVariable(name = "id")
          UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Search reference facilities for the given knowledge factor 'name'.
  Excludes facilities created from external sources.
  Caution: The returned ids of the reference facilities must not be stored.
  """)
  SearchReferenceFacilitiesResponse searchReferenceFacilities(
      @Parameter(
              description =
                  "The name of the Facility (knowledge factor) which shall be searched for.")
          @NotBlank
          @RequestParam(value = "name")
          String name);

  @GetExchange(FILE_STATES_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the Ids of all other facility file states associated with the reference facility of the given file state")
  GetFileStateIdsResponse getFacilityFileStateIdsWithSameReferenceFacility(
      @Parameter(description = "The Id of the File State of the Facility.") @PathVariable("id")
          UUID id);

  @GetExchange(REFERENCE_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the Ids of all facility file states associated with the given reference facility")
  GetFileStateIdsResponse getFacilityFileStateIdsAssociatedWithReferenceFacility(
      @Parameter(description = "The Id of the Reference Facility.") @PathVariable("id") UUID id);

  @PostExchange(FILE_STATES_URL + "/bulk-get")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get multiple facilities")
  GetFacilityFileStatesResponse getFacilityFileStates(
      @Valid @RequestBody GetFacilityFileStatesRequest request);

  @PostExchange(FILE_STATES_URL + "/bulk-add")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Add multiple facility file states in a bulk operation.
Each file state is linked to a reference facility whose name and mandatory
contact address fields match; other fields are not taken into account here. If
no such facility exists, a new one will be created.
""")
  AddFacilityFileStatesResponse addFacilityFileStates(
      @Parameter(description = "A list of Facilities that shall be added to the Central Files.")
          @RequestBody
          @Valid
          AddFacilityFileStatesRequest request);

  @PostExchange(FILE_STATES_URL + "/mark-for-deletion")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Mark this file state for deletion at a later time.
  This can be used to clean up draft procedures or appointments and spam data.
  The file state will be deleted after a grace period, to allow for recovery.
  """)
  void markFacilityFileStateForDeletion(@RequestBody @Valid DeleteFileStatesRequest list);

  @PostExchange(FILE_STATES_URL + "/archive-deletion")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Delete this file state as soon as possible.
  This is used during an archival process, where the file states are moved to an archive and thereby deleted from the central file.
  To delete file states under normal cleanup, use /mark-for-deletion instead.
  """)
  void deleteFacilityFileStateDuringArchive(@RequestBody @Valid DeleteFileStatesRequest list);

  @GetExchange(FILE_STATES_URL + "/{id}/diff")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Get the difference between the requested file state and its associated reference facility.
  """)
  GetFacilityDiffResponse getFacilityDiff(@PathVariable("id") UUID id);

  @PostExchange(FILE_STATES_URL + "/{id}/update-file-state-and-reference")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Perform a consistent update of the existent facility file state and its
associated reference facility
""")
  AddFacilityFileStateResponse updateFacilityFileStateAndReference(
      @Parameter(description = "The id of the file state") @PathVariable("id") UUID id,
      @RequestBody @Valid PutFacilityRequest request);

  @PostExchange(FILE_STATES_URL + "/{id}/sync-file-state")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Update a differing facility file state by taking over the data from the
associated reference facility
""")
  AddFacilityFileStateResponse syncFacilityFileState(
      @Parameter(description = "The id of the file state") @PathVariable("id") UUID id,
      @RequestBody @Valid SyncFileStateRequest request);

  @PostExchange(FILE_STATES_URL + BaseUrls.Base.FACILITY_EXTERNAL_DATA_SOURCE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Create a new facility file state as well as a new associated reference
facility, without any matching to existing data.
This endpoint requires a valid authentication from the citizen portal.
The created data are labelled as external and are thus regarded as temporary,
unconfirmed and untrustworthy.
It is intended that the data first has to run through a verification process
performed by a health office employee before it can be used for further purposes.
""")
  AddFacilityFileStateResponse addFacilityFromExternalSource(
      @RequestBody @Valid ExternalAddFacilityFileStateRequest request);

  @PostExchange(REFERENCE_UPDATE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Updates reference facility data identified by given id. Sets dataOrigin to DataOrigin.EDIT.
Returns a new file state with the resulting new state.
""")
  AddFacilityFileStateResponse updateReferenceFacility(
      @PathVariable("id") UUID referenceDataId,
      @RequestBody @Valid UpdateReferenceFacilityRequest request);
}
