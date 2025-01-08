/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.inventory.api.*;
import de.eshg.base.inventory.persistence.InventoryService;
import de.eshg.base.inventory.persistence.entity.InventoryItem;
import de.eshg.base.inventory.persistence.entity.InventoryItemBooking;
import de.eshg.base.inventory.persistence.entity.InventoryItemType;
import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Inventory")
public class InventoryController implements InventoryApi {

  private final InventoryService inventoryService;
  private final UserService userService;

  public InventoryController(InventoryService inventoryService, UserService userService) {
    this.inventoryService = inventoryService;
    this.userService = userService;
  }

  @Override
  @Transactional
  public InventoryItemDto addInventoryItem(AddInventoryItemRequest request) {
    InventoryItem item = InventoryMapper.mapInventoryItemToDm(request);
    if (request.labelNames() != null) {
      inventoryService.assignLabelsToInventoryItem(item, request.labelNames());
    }

    InventoryItem savedInventoryItem = inventoryService.addInventoryItem(item);
    if (request.count() > 0) {
      inventoryService.restock(savedInventoryItem.getId(), request.count());
      savedInventoryItem.setCount(request.count());
    }

    return InventoryMapper.mapInventoryItemToApi(savedInventoryItem);
  }

  @Override
  @Transactional(readOnly = true)
  public InventoryItemDto getInventoryItem(UUID id) {
    InventoryItem item = inventoryService.findByIdOrThrow(id);
    return InventoryMapper.mapInventoryItemToApi(item);
  }

  @Override
  @Transactional(readOnly = true)
  public GetInventoryItemsResponse getInventoryItems(InventoryItemFilterParameters parameters) {
    PageSpec pageSpec =
        InventoryMapper.mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(InventorySortKey.TYPE),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    InventoryItemType inventoryItemType =
        InventoryMapper.mapInventoryItemTypeToDm(parameters.type());
    Page<InventoryItem> items =
        inventoryService.findAll(
            parameters.name(), inventoryItemType, parameters.label(), pageSpec);
    return InventoryMapper.mapInventoryItemsToApi(items);
  }

  @Override
  public InventoryItemBookingEntry bookInventoryItem(UUID id, BookInventoryItemRequest request) {
    try {
      InventoryItemBooking booking = inventoryService.book(id, request.bookingCount());
      return InventoryMapper.mapInventoryBookingToApi(booking, true);
    } catch (OptimisticLockingFailureException ex) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Failed booking due to conflict");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public InventoryItemBookingEntry getInventoryItemBooking(UUID id, long bookingId) {
    return InventoryMapper.mapInventoryBookingToApi(
        inventoryService.findBookingByIdOrThrow(id, bookingId));
  }

  @Override
  public InventoryItemBookingEntry cancelInventoryItemBooking(
      UUID id, long bookingId, UUID ownerKey) {
    try {
      InventoryItemBooking booking = inventoryService.cancelBooking(id, bookingId, ownerKey);
      return InventoryMapper.mapInventoryBookingToApi(booking);
    } catch (OptimisticLockingFailureException ex) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Failed to cancel booking due to conflict");
    }
  }

  @Override
  public InventoryItemBookingEntry restockInventoryItem(
      UUID id, RestockInventoryItemRequest request) {
    try {
      InventoryItemBooking delivery = inventoryService.restock(id, request.restockingCount());
      return InventoryMapper.mapInventoryBookingToApi(delivery, true);
    } catch (OptimisticLockingFailureException ex) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Failed restocking due to conflict");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public InventoryItemBookingHistory getInventoryBookingHistory(
      UUID id, Integer pageNumber, Integer pageSize) {
    InventoryItem item = inventoryService.findByIdOrThrow(id);
    Page<InventoryItemBooking> history =
        inventoryService.getBookingHistory(item, pageNumber, pageSize);
    List<UUID> userIds = history.stream().map(InventoryItemBooking::getBookedBy).toList();
    Map<UUID, UserDto> resolvedUsers =
        userService.getUsers(userIds, true).stream()
            .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
    return new InventoryItemBookingHistory(
        InventoryMapper.mapInventoryItemToApi(item),
        history.stream().map(InventoryMapper::mapInventoryBookingToApi).toList(),
        history.getTotalElements(),
        resolvedUsers);
  }

  @Override
  @Transactional
  public InventoryItemDto updateInventoryItem(UUID id, UpdateInventoryItemRequest request) {
    InventoryItem updated = inventoryService.update(id, request);
    return InventoryMapper.mapInventoryItemToApi(updated);
  }

  @Override
  @Transactional
  public void updateInventoryItemCount(UUID id, UpdateInventoryItemCountRequest request) {
    inventoryService.correctCount(id, request.version(), request.count());
  }
}
