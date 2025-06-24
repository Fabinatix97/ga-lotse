/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkResponse;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = PersonApi.BASE_URL)
public interface PersonApi {

  String BASE_URL = BaseUrls.Base.PERSON_API;
  String FILE_STATES_URL = BaseUrls.Base.PERSON_FILE_STATE_URL;
  String REFERENCE_URL = "/reference";
  String REFERENCE_UPDATE_URL = REFERENCE_URL + "/{id}/update";
  String ARCHIVE_DELETION = "/archive-deletion";

  @PostExchange(FILE_STATES_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Add a new person file state and associate it with a reference person.
          If no reference id is provided, an existing reference person with matching personal data is selected or (if
          it does not exist) created for this purpose.
          """)
  AddPersonFileStateResponse addPersonFileState(
      @RequestBody @Valid AddPersonFileStateRequest request);

  @GetExchange(FILE_STATES_URL + "/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a person")
  GetPersonFileStateResponse getPersonFileState(
      @Parameter(description = "The Id of the File State of the Person.") @PathVariable("id")
          UUID id);

  @GetExchange(FILE_STATES_URL + "/{id}/reference-person")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Get the data of the reference person associated with a given person file state
  Caution: The returned ids of the reference person must not be stored.
  """)
  GetReferencePersonResponse getReferencePerson(
      @Parameter(description = "The Id of the File State of the Person.") @PathVariable(name = "id")
          UUID id);

  @GetExchange(FILE_STATES_URL + "/reference-persons")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Get the data of the reference persons associated with given person file states
      Caution: The returned ids of the reference persons must not be stored.
      """)
  GetReferencePersonsResponse getReferencePersons(
      @Parameter(description = "The Ids of the File State of the Persons.") @Valid @RequestBody
          List<UUID> id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Search reference persons for the given knowledge factors 'firstName', 'lastName' and 'dateOfBirth'.
  Excludes persons created from external sources.
  Caution: The returned ids of the reference persons must not be stored.
  """)
  SearchReferencePersonsResponse searchReferencePersons(
      @Parameter(
              description =
                  "The first name of the Person (1 of 3 knowledge factors) which shall be searched for.")
          @RequestParam(name = "firstName")
          String firstName,
      @Parameter(
              description =
                  "The last name of the Person (1 of 3 knowledge factors) which shall be searched for.")
          @RequestParam(name = "lastName")
          String lastName,
      @Parameter(
              description =
                  "The date of birth of the Person (1 of 3 knowledge factors) which shall be searched for.")
          @RequestParam(name = "dateOfBirth")
          LocalDate dateOfBirth);

  @GetExchange("/by-human-readable-id")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Search reference persons by humanReadableId.
Includes persons created from external sources.
Caution: The returned ids of the reference persons must not be stored.
""")
  SearchReferencePersonsResponse searchReferencePersonsByHumanReadableId(
      @Parameter(description = "The human readable ID of the Person which shall be searched for.")
          @RequestParam(name = "humanReadableId")
          String humanReadableId);

  @GetExchange("/partial")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Search reference persons for the given knowledge factors 'firstName', 'lastName' and 'dateOfBirth',
without the need for specifying all three. However, searching for only a first name or only a last
name is prohibited.
Excludes persons created from external sources.
Caution: The returned ids of the reference persons must not be stored.
""")
  SearchReferencePersonsWithPartialKnowledgeFactorsResponse
      searchReferencePersonsWithPartialKnowledgeFactors(
          @Parameter(
                  description =
                      "The first name of the Person (1 of 3 knowledge factors) which shall be searched for.")
              @RequestParam(name = "firstName", required = false)
              String firstName,
          @Parameter(
                  description =
                      "The last name of the Person (1 of 3 knowledge factors) which shall be searched for.")
              @RequestParam(name = "lastName", required = false)
              String lastName,
          @Parameter(
                  description =
                      "The date of birth of the Person (1 of 3 knowledge factors) which shall be searched for.")
              @RequestParam(name = "dateOfBirth", required = false)
              LocalDate dateOfBirth);

  @GetExchange(FILE_STATES_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the Ids of all other person file states associated with the reference person of the given file state")
  GetFileStateIdsResponse getPersonFileStateIdsAssociatedWithFileState(
      @Parameter(description = "The Id of the File State of the Person.") @PathVariable("id")
          UUID id);

  @PostExchange(FILE_STATES_URL + "/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Get the Ids of all other person file states associated with the reference person of the given file state")
  GetFileStateIdsBulkResponse getPersonFileStateIdsAssociatedWithFileStates(
      @Valid @RequestBody GetFileStateIdsBulkRequest request);

  @GetExchange(REFERENCE_URL + "/{id}/linked-ids")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Get the Ids of all person file states associated with the given reference person")
  GetFileStateIdsResponse getPersonFileStateIdsAssociatedWithReferencePerson(
      @Parameter(description = "The Id of the Reference Data of the Person.") @PathVariable("id")
          UUID id);

  @PostExchange(FILE_STATES_URL + "/bulk-add")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
    Add multiple persons and associate each with a reference person.
    If no reference person matches the mandatory parameters of the new file state, a new reference person is created.
    Non-mandatory parameters are ignored when searching for matching reference persons.
    """)
  AddPersonFileStatesResponse addPersonFileStates(
      @Parameter(description = "A list of Persons that shall be added to the Central Files.")
          @RequestBody
          @Valid
          AddPersonFileStatesRequest request);

  @PostExchange(FILE_STATES_URL + "/bulk-search")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
    Search multiple reference persons by the given key attributes
    and return all file state ids associated with these reference persons.
    """)
  GetPersonFileStateIdsByKeyAttributesResponse getPersonFileStateIdsByReferencePersonKeyAttributes(
      @Valid @RequestBody GetPersonFileStateIdsByKeyAttributesRequest request);

  @PostExchange(FILE_STATES_URL + "/bulk-get")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get multiple persons")
  GetPersonFileStatesResponse getPersonFileStates(
      @Valid @RequestBody GetPersonFileStatesRequest request);

  @PostExchange(FILE_STATES_URL + "/mark-for-deletion")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Mark this file state for deletion at a later time.
  This can be used to clean up draft procedures or appointments and spam data.
  The file state will be deleted after a grace period, to allow for recovery.
  """)
  void markPersonFileStateForDeletion(@RequestBody @Valid DeleteFileStatesRequest list);

  @PostExchange(FILE_STATES_URL + ARCHIVE_DELETION)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Delete this file state as soon as possible.
  This is used during an archival process, where the file states are moved to an archive and thereby deleted from the central file.
  To delete file states under normal cleanup, use /mark-for-deletion instead.
  """)
  void deletePersonFileStateDuringArchive(@RequestBody @Valid DeleteFileStatesRequest list);

  @PostExchange(FILE_STATES_URL + "/{id}/update-file-state-and-reference")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Perform a consistent update of the existent person file state and its
  associated reference person
  """)
  AddPersonFileStateResponse updatePersonFileStateAndReference(
      @PathVariable("id") UUID id, @RequestBody @Valid UpdatePersonRequest request);

  @PostExchange(FILE_STATES_URL + "/{id}/sync-file-state")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Update a differing person file state by taking over the personal data from the
associated reference person
""")
  AddPersonFileStateResponse syncFileState(
      @PathVariable("id") UUID id, @RequestBody @Valid SyncFileStateRequest request);

  @GetExchange(FILE_STATES_URL + "/{id}/diff")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Get the difference between the requested file state and its associated reference person.
""")
  GetPersonDiffResponse getPersonDiff(@PathVariable("id") UUID id);

  @PostExchange(FILE_STATES_URL + "/bulk-update")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
       Perform a consistent update of person file states and their associated
       reference persons in a bulk operation.
       """)
  UpdatePersonsResponse updatePersonFileStatesAndReferences(
      @RequestBody @Valid UpdatePersonsRequest request);

  @PostExchange(FILE_STATES_URL + BaseUrls.Base.PERSON_EXTERNAL_DATA_SOURCE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
Create a new person file state as well as a new associated reference person,
without any matching to existing data.
This endpoint requires a valid authentication from the citizen portal.
The created data are labelled as external and are thus regarded as temporary,
unconfirmed and untrustworthy. It must undergo a verification process performed
by a health office employee before it can be used for any official processes.
The only exception to this are GDPR-related procedures, where the data may be
used immediately.
""")
  AddPersonFileStateResponse addPersonFromExternalSource(
      @RequestBody @Valid ExternalAddPersonFileStateRequest request);

  @PostExchange(REFERENCE_UPDATE_URL)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
  Updates reference person data identified by given id. Sets dataOrigin to DataOrigin.EDIT.
  Returns a new file state with the resulting new state.
  """)
  AddPersonFileStateResponse updateReferencePerson(
      @PathVariable("id") UUID referenceDataId,
      @RequestBody @Valid UpdateReferencePersonRequest request);

  @PostExchange(REFERENCE_URL + "/bulk-update")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Updates reference persons data identified by given ids. Sets dataOrigin to DataOrigin.EDIT.
      Returns new file states with the resulting new states.
      """)
  UpdatePersonsResponse updateReferencePersons(
      @RequestBody @Valid UpdateReferencePersonsRequest request);
}
