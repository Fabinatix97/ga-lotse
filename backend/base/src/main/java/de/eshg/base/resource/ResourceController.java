/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource;

import de.eshg.base.SortDirection;
import de.eshg.base.resource.api.*;
import de.eshg.base.resource.persistence.ResourceService;
import de.eshg.base.resource.persistence.entity.Resource;
import de.eshg.base.resource.persistence.entity.ResourceType;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.mutex.MutexService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Resource")
public class ResourceController implements ResourceApi {
  public static final String MUTEX_RESOURCE_WRITE = "RESOURCE_WRITE";

  private final ResourceService resourceService;
  private final MutexService mutexService;

  public ResourceController(ResourceService resourceService, MutexService mutexService) {
    this.resourceService = resourceService;
    this.mutexService = mutexService;
  }

  @Override
  public ResourceDto addResource(AddResourceRequest request) {
    return mutexService.doWithLockedMutex(MUTEX_RESOURCE_WRITE, () -> addResourceLocked(request));
  }

  private ResourceDto addResourceLocked(AddResourceRequest request) {
    Resource resource = ResourceMapper.mapResourceToDm(request);
    Resource saved = resourceService.addResource(resource, request.labelNames());
    return ResourceMapper.mapResourceToApi(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceDto getResource(UUID id) {
    Resource resource = resourceService.findByIdOrThrow(id);
    return ResourceMapper.mapResourceToApi(resource);
  }

  @Override
  @Transactional(readOnly = true)
  public GetResourcesResponse getResources(ResourceFilterParameters parameters) {
    PageSpec pageSpec =
        ResourceMapper.mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(ResourceSortKey.TYPE),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    ResourceType resourceType = ResourceMapper.mapResourceTypeToDm(parameters.type());
    Page<Resource> resources =
        resourceService.findAll(parameters.name(), resourceType, parameters.label(), pageSpec);

    return ResourceMapper.mapResourcesToApi(resources);
  }

  @Override
  public ResourceDto updateResource(UUID id, UpdateResourceRequest request) {
    return mutexService.doWithLockedMutex(
        MUTEX_RESOURCE_WRITE, () -> updateResourceLocked(id, request));
  }

  private ResourceDto updateResourceLocked(UUID id, UpdateResourceRequest request) {
    Resource resource = resourceService.updateResource(id, request);
    return ResourceMapper.mapResourceToApi(resource);
  }
}
