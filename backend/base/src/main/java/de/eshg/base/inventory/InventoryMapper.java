/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory;

import static de.eshg.base.util.MappingUtil.mapDirection;

import de.eshg.base.SortDirection;
import de.eshg.base.inventory.api.*;
import de.eshg.base.inventory.api.AddInventoryItemRequest;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.inventory.api.InventoryItemTypeDto;
import de.eshg.base.inventory.api.InventorySortKey;
import de.eshg.base.inventory.persistence.InventoryService;
import de.eshg.base.inventory.persistence.entity.*;
import de.eshg.base.inventory.persistence.entity.InventoryItem;
import de.eshg.base.inventory.persistence.entity.InventoryItemType;
import de.eshg.base.inventory.persistence.entity.InventoryItem_;
import de.eshg.base.label.LabelMapper;
import de.eshg.base.util.PaginationUtil.PageSpec;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public class InventoryMapper {

  private InventoryMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static InventoryItem mapInventoryItemToDm(AddInventoryItemRequest request) {
    InventoryItem item = new InventoryItem();
    item.setName(request.name());
    item.setDescription(request.description());
    item.setArticleNumber(request.articleNumber());
    item.setType(mapInventoryItemTypeToDm(request.type()));
    item.setMinCount(request.minCount());
    return item;
  }

  public static InventoryItemType mapInventoryItemTypeToDm(InventoryItemTypeDto type) {
    return switch (type) {
      case null -> null;
      case VACCINE -> InventoryItemType.VACCINE;
      case TEST_KIT -> InventoryItemType.TEST_KIT;
      case PROTECTIVE_EQUIPMENT -> InventoryItemType.PROTECTIVE_EQUIPMENT;
      case MISC -> InventoryItemType.MISC;
    };
  }

  public static InventoryItemDto mapInventoryItemToApi(InventoryItem savedInventoryItem) {
    return new InventoryItemDto(
        savedInventoryItem.getId(),
        savedInventoryItem.getVersion(),
        savedInventoryItem.getName(),
        savedInventoryItem.getDescription(),
        savedInventoryItem.getArticleNumber(),
        mapInventoryItemTypeToApi(savedInventoryItem.getType()),
        savedInventoryItem.getLabels().stream()
            .map(LabelMapper::mapLabelToApi)
            .sorted((l1, l2) -> l1.name().compareToIgnoreCase(l2.name()))
            .toList(),
        savedInventoryItem.getCount(),
        savedInventoryItem.getMinCount());
  }

  private static InventoryItemTypeDto mapInventoryItemTypeToApi(InventoryItemType type) {
    return switch (type) {
      case VACCINE -> InventoryItemTypeDto.VACCINE;
      case TEST_KIT -> InventoryItemTypeDto.TEST_KIT;
      case PROTECTIVE_EQUIPMENT -> InventoryItemTypeDto.PROTECTIVE_EQUIPMENT;
      case MISC -> InventoryItemTypeDto.MISC;
    };
  }

  public static GetInventoryItemsResponse mapInventoryItemsToApi(Page<InventoryItem> items) {
    return new GetInventoryItemsResponse(
        items.stream().map(InventoryMapper::mapInventoryItemToApi).toList(),
        items.getTotalElements());
  }

  public static InventoryItemBookingEntry mapInventoryBookingToApi(InventoryItemBooking booking) {
    return mapInventoryBookingToApi(booking, false);
  }

  public static InventoryItemBookingEntry mapInventoryBookingToApi(
      InventoryItemBooking booking, boolean includeOwnerKey) {
    return new InventoryItemBookingEntry(
        booking.getId(),
        booking.getInventoryItem().getId(),
        mapBookingStatusToApi(booking.getStatus()),
        mapBookingTypeToApi(booking.getType()),
        booking.getBookedBy(),
        booking.getBookedAt(),
        booking.getAmount(),
        includeOwnerKey ? booking.getOwnerKey() : null);
  }

  public static InventoryBookingStatusDto mapBookingStatusToApi(InventoryBookingStatus status) {
    return switch (status) {
      case ACTIVE -> InventoryBookingStatusDto.ACTIVE;
      case CANCELLED -> InventoryBookingStatusDto.CANCELLED;
    };
  }

  public static InventoryBookingTypeDto mapBookingTypeToApi(InventoryBookingType type) {
    return switch (type) {
      case BOOKING -> InventoryBookingTypeDto.BOOKING;
      case DELIVERY -> InventoryBookingTypeDto.DELIVERY;
      case CORRECTION -> InventoryBookingTypeDto.CORRECTION;
    };
  }

  public static PageSpec mapToPageSpec(
      int page, int pageSize, InventorySortKey sortKey, SortDirection direction) {
    return new PageSpec(page, pageSize, mapToSortOrder(sortKey, direction));
  }

  private static Sort.Order mapToSortOrder(InventorySortKey sortKey, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortKey(sortKey));
  }

  private static String mapSortKey(InventorySortKey sortKey) {
    return switch (sortKey) {
      case null -> InventoryItem_.TYPE;
      case InventorySortKey.COUNT -> InventoryItem_.COUNT;
      case InventorySortKey.NAME -> InventoryItem_.NAME;
      case InventorySortKey.TYPE -> InventoryItem_.TYPE;
      case InventorySortKey.RELEVANCE -> InventoryService.RELEVANCE_SORT_KEY;
    };
  }
}
