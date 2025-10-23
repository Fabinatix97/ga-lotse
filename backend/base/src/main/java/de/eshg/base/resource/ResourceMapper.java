/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource;

import static de.eshg.base.util.MappingUtil.mapDirection;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.label.LabelMapper;
import de.eshg.base.resource.api.*;
import de.eshg.base.resource.persistence.ResourceService;
import de.eshg.base.resource.persistence.entity.Resource;
import de.eshg.base.resource.persistence.entity.ResourceType;
import de.eshg.base.resource.persistence.entity.Resource_;
import de.eshg.base.util.PaginationUtil.PageSpec;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public class ResourceMapper {

  private ResourceMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static Resource mapResourceToDm(AddResourceRequest request) {
    Resource resource = new Resource();
    resource.setName(request.name());
    resource.setDescription(request.description());
    resource.setArticleNumber(request.articleNumber());
    resource.setType(mapResourceTypeToDm(request.type()));
    return resource;
  }

  public static ResourceType mapResourceTypeToDm(ResourceTypeDto type) {
    return switch (type) {
      case null -> null;
      case BICYCLE -> ResourceType.BICYCLE;
      case CAMERA -> ResourceType.CAMERA;
      case CAR -> ResourceType.CAR;
      case LAPTOP -> ResourceType.LAPTOP;
      case MEASURING_DEVICE -> ResourceType.MEASURING_DEVICE;
      case MEASURING_KIT -> ResourceType.MEASURING_KIT;
      case MISC -> ResourceType.MISC;
      case ROOM -> ResourceType.ROOM;
      case TABLET -> ResourceType.TABLET;
    };
  }

  public static ResourceDto mapResourceToApi(Resource savedResource) {
    return new ResourceDto(
        savedResource.getId(),
        savedResource.getName(),
        savedResource.getDescription(),
        savedResource.getArticleNumber(),
        mapResourceTypeToApi(savedResource.getType()),
        savedResource.getLabels().stream()
            .map(LabelMapper::mapLabelToApi)
            .sorted((l1, l2) -> l1.name().compareToIgnoreCase(l2.name()))
            .toList());
  }

  private static ResourceTypeDto mapResourceTypeToApi(ResourceType type) {
    return switch (type) {
      case BICYCLE -> ResourceTypeDto.BICYCLE;
      case CAMERA -> ResourceTypeDto.CAMERA;
      case CAR -> ResourceTypeDto.CAR;
      case LAPTOP -> ResourceTypeDto.LAPTOP;
      case MEASURING_DEVICE -> ResourceTypeDto.MEASURING_DEVICE;
      case MEASURING_KIT -> ResourceTypeDto.MEASURING_KIT;
      case MISC -> ResourceTypeDto.MISC;
      case ROOM -> ResourceTypeDto.ROOM;
      case TABLET -> ResourceTypeDto.TABLET;
    };
  }

  public static GetResourcesResponse mapResourcesToApi(Page<Resource> resources) {
    return new GetResourcesResponse(
        resources.stream().map(ResourceMapper::mapResourceToApi).toList(),
        resources.getTotalElements());
  }

  public static PageSpec mapToPageSpec(
      int page, int pageSize, ResourceSortKey sortKey, SortDirection direction) {
    return new PageSpec(page, pageSize, mapToSortOrder(sortKey, direction));
  }

  private static Sort.Order mapToSortOrder(ResourceSortKey sortKey, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortKey(sortKey));
  }

  private static String mapSortKey(ResourceSortKey sortKey) {
    return switch (sortKey) {
      case null -> Resource_.TYPE;
      case ResourceSortKey.NAME -> Resource_.NAME;
      case ResourceSortKey.TYPE -> Resource_.TYPE;
      case ResourceSortKey.RELEVANCE -> ResourceService.RELEVANCE_SORT_KEY;
    };
  }
}
