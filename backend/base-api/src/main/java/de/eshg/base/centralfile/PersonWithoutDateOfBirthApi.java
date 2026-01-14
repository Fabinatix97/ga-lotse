/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.person.*;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = PersonWithoutDateOfBirthApi.BASE_URL)
public interface PersonWithoutDateOfBirthApi {

  String BASE_URL = BaseUrls.Base.PERSON_WITHOUT_DATE_OF_BIRTH_API;
  String BULK_DELETE = "/bulk/delete";
  String BULK_MARK_FOR_DELETION = "/bulk/mark-for-deletion";

  @PostExchange("/create")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a new person without date of birth.")
  GetPersonWithoutDateOfBirthResponse addPersonWithoutDateOfBirth(
      @RequestBody @Valid AddPersonWithoutDateOfBirthRequest request);

  @PostExchange("/bulk/create")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add new persons without date of birth.")
  GetPersonsWithoutDateOfBirthResponse addPersonsWithoutDateOfBirth(
      @RequestBody @Valid AddPersonsWithoutDateOfBirthRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a person without date of birth")
  GetPersonWithoutDateOfBirthResponse getPersonWithoutDateOfBirth(
      @Parameter(description = "The Id of the person without date of birth.") @PathVariable("id")
          UUID id);

  @PostExchange("/bulk")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a list of persons without date of birth")
  GetPersonsWithoutDateOfBirthResponse getPersonsWithoutDateOfBirth(
      @Parameter(description = "The Ids of the persons without date of birth.") @Valid @RequestBody
          List<UUID> id);

  @DeleteExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Delete a person without date of birth")
  void deletePersonWithoutDateOfBirth(
      @Parameter(description = "The Id of the person without date of birth.") @PathVariable("id")
          UUID id);

  @PostExchange(BULK_DELETE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Delete persons without date of birth")
  void deletePersonsWithoutDateOfBirth(
      @Parameter(description = "The Ids of the persons without date of birth.") @Valid @RequestBody
          List<UUID> id);

  @PostExchange(BULK_MARK_FOR_DELETION)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Mark persons for deletion at a later time.
      This can be used to clean up draft procedures or appointments and spam data.
      The entries will be deleted after a grace period, to allow for recovery.
      """)
  void markPersonsWithoutDateOfBirthForDeletion(
      @Parameter(description = "The Ids of the persons without date of birth.") @Valid @RequestBody
          List<UUID> id);

  @PutExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Update a person without date of birth.")
  GetPersonWithoutDateOfBirthResponse updatePersonWithoutDateOfBirth(
      @Parameter(description = "The Id of the person without date of birth.") @PathVariable("id")
          UUID id,
      @RequestBody @Valid UpdatePersonWithoutDateOfBirthRequest request);
}
