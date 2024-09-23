/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.inventory.api.*;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.*;

@HttpExchange(url = InventoryApi.BASE_URL)
public interface InventoryApi {

  String BASE_URL = BaseUrls.Base.INVENTORY_API;
  String BOOKING = BaseUrls.Base.INVENTORY_BOOKING_URL;
  String RESTOCKING = BaseUrls.Base.INVENTORY_RESTOCKING_URL;
  String CORRECTION = BaseUrls.Base.INVENTORY_CORRECTION_URL;

  @PostExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a new Inventory Item")
  InventoryItemDto addInventoryItem(@RequestBody @Valid AddInventoryItemRequest request);

  @GetExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get an Inventory Item")
  InventoryItemDto getInventoryItem(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id);

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Search inventory items. Filter results by the optional parameters 'name', 'type' and label. Sort and page the
           results by default values or by optional parameters
          """)
  GetInventoryItemsResponse getInventoryItems(
      @InlineParameterObject @ParameterObject @Valid InventoryItemFilterParameters parameters);

  @PostExchange("/{id}" + BOOKING)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Book a certain amount of stock for a given inventory item,
           returns a booking entry with the relevant booking id on success.
           """)
  InventoryItemBookingEntry bookInventoryItem(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @RequestBody @Valid BookInventoryItemRequest request);

  @GetExchange("/{id}" + BOOKING + "/{bookingId}")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get a booking entry")
  InventoryItemBookingEntry getInventoryItemBooking(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @Parameter(description = "The public Id of the booking of the given Inventory Item.")
          @PathVariable("bookingId")
          long bookingId);

  @PostExchange("/{id}" + BOOKING + "/{bookingId}/cancel")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Cancel the booking request for the given inventory.
           Does nothing if the booking was already cancelled.
           This is only supported for entries of type BOOKING.
           """)
  InventoryItemBookingEntry cancelInventoryItemBooking(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @Parameter(description = "The public Id of the booking of the given Inventory Item.")
          @PathVariable("bookingId")
          long bookingId,
      @Parameter(description = "The private Id that was returned when booking the Inventory Item.")
          @RequestParam(name = "ownerKey", required = false)
          UUID ownerKey);

  @GetExchange("/{id}" + BOOKING + "/history")
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Get the history of booking operations for a given inventory item")
  InventoryItemBookingHistory getInventoryBookingHistory(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @Parameter(
              description =
                  "Part of pagination. Specifies the page of the paginated booking entries that is returned in the response.")
          @RequestParam(value = "pageNumber", required = false, defaultValue = "0")
          @PositiveOrZero
          Integer pageNumber,
      @Parameter(
              description =
                  "Part of pagination. Specifies the number of booking entries which shall be on a single page. Only this amount of entries is returned in the response.")
          @RequestParam(value = "pageSize", required = false, defaultValue = "25")
          @Min(1)
          @Max(50)
          Integer pageSize);

  @PostExchange("/{id}" + RESTOCKING)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Add a certain amount of stock for a given inventory item")
  InventoryItemBookingEntry restockInventoryItem(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @RequestBody @Valid RestockInventoryItemRequest request);

  @PutExchange("/{id}")
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
           Update an inventory item. Any provided label names will be used to resolve existing labels from the
           database, use the same name where applicable
          """)
  InventoryItemDto updateInventoryItem(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @RequestBody @Valid UpdateInventoryItemRequest request);

  @PostExchange("/{id}" + CORRECTION)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary =
          """
      Update the item count by providing the current version and new count.
      If the current version does not match, a conflict error is returned to avoid race conditions.
      """)
  void updateInventoryItemCount(
      @Parameter(description = "Id of the Inventory Item.") @PathVariable("id") UUID id,
      @RequestBody @Valid UpdateInventoryItemCountRequest request);
}
