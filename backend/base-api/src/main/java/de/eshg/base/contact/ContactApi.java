/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact;

import static de.eshg.rest.service.security.config.BaseUrls.Base.BULK_GET_URL_END;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.address.AddressDto;
import de.eshg.base.contact.api.*;
import de.eshg.base.history.HistoryStep;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.io.IOException;
import java.time.Instant;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(url = ContactApi.BASE_URL)
public interface ContactApi {

  String BASE_URL = BaseUrls.Base.CONTACT_API;
  String PARSE_VCARD = BaseUrls.Base.CONTACT_PARSE_VCARD_URL;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a contact")
  ContactDto addContact(@RequestBody @Valid AbstractAddContactRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a contact")
  ContactDto getContact(
      @Parameter(description = "The Id of the Contact.") @PathVariable("id") UUID id);

  @PostExchange(BULK_GET_URL_END)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get contacts for provided ids in bulk.")
  GetContactsResponse getBulkContacts(@RequestBody @Valid GetContactsRequest request);

  @GetExchange("/{id}/history")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get contact history")
  GetContactHistoryResponse getContactHistory(
      @Parameter(description = "The Id of the Contact.") @PathVariable("id") UUID id,
      @Parameter(
              description =
                  "A filter to only show history entries done by a certain User, whose Id is specified here.")
          @RequestParam(value = "userId", required = false)
          UUID userId,
      @Parameter(description = "A filter to only show history entries before a certain time.")
          @RequestParam(value = "before", required = false)
          Instant before);

  @GetExchange("/{id}/history/{historyId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get base contact history step by revision id.")
  HistoryStep<ContactDto> getContactHistoryStep(
      @Parameter(description = "The Id of the Contact.") @PathVariable("id") UUID id,
      @Parameter(description = "The revision Id of the history step of the address of the Contact.")
          @PathVariable("historyId")
          @Min(1)
          long historyId);

  @GetExchange("/{id}/addresses/{addressId}/history/{historyId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get address history step by revision id.")
  HistoryStep<AddressDto> getContactAddressHistoryStep(
      @Parameter(description = "The Id of the Contact.") @PathVariable("id") UUID id,
      @Parameter(description = "The Id of the address under consideration.")
          @PathVariable("addressId")
          long addressId,
      @Parameter(description = "The revision Id of the history step of the address of the Contact.")
          @PathVariable("historyId")
          @Min(1)
          long historyId);

  @PutExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          "Update an existing contact. Passing another contact ID using 'mergedFrom' will merge the specified contact into this one.")
  ContactDto updateContact(
      @Parameter(description = "The Id of the Contact.") @PathVariable("id") UUID id,
      @RequestBody @Valid AbstractUpdateContactRequest request);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
          Search contacts. Filter results by the optional parameters 'name', 'type', 'category', 'firstName' or 'street'.
          'firstName' only exists in Contacts of type Person, so no Institutions can be found if it is set.
          In the same way, 'category' only exists in Contacts of type Institution, so no Person contacts can be found
          if it is set.
          Sort and page the results by default values or by optional parameters.
         """)
  SearchContactsResponse getContacts(
      @InlineParameterObject @ParameterObject @Valid ContactFilterParameters parameters);

  @PostExchange(value = PARSE_VCARD + "/institutions", contentType = MULTIPART_FORM_DATA_VALUE)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Parse a vcf file (VCard) of an institution contact and get possible matches")
  ImportInstitutionContactResponse importInstitutionContact(
      @Parameter(
              description =
                  "A .vcf file (vCard) with details of the institution contact, that shall be parsed.")
          @RequestParam("file")
          MultipartFile file)
      throws IOException;

  @PostExchange(value = PARSE_VCARD + "/persons", contentType = MULTIPART_FORM_DATA_VALUE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Parse a vcf file (VCard) of a person contact and get possible matches")
  ImportPersonContactResponse importPersonContact(
      @Parameter(
              description =
                  "A .vcf file (vCard) with details of the person contact, that shall be parsed.")
          @RequestParam("file")
          MultipartFile file)
      throws IOException;
}
