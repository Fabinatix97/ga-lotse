/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.base.SortDirection;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.api.geoshape.AbstractGeoShapeChangeRequest;
import de.eshg.statistics.api.geoshape.GeoShapeChangeStatusRequest;
import de.eshg.statistics.api.geoshape.GeoShapeChangeTitleRequest;
import de.eshg.statistics.api.geoshape.GeoShapeDto;
import de.eshg.statistics.api.geoshape.GeoShapeMetaInfo;
import de.eshg.statistics.api.geoshape.GeoShapeSortKey;
import de.eshg.statistics.api.geoshape.GeoShapeStatusDto;
import de.eshg.statistics.api.geoshape.GetGeoShapesResponse;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.GeoShape;
import de.eshg.statistics.persistence.entity.GeoShapeStatus;
import de.eshg.statistics.persistence.entity.GeoShape_;
import de.eshg.statistics.persistence.repository.GeoShapeRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GeoShapeService {
  private final GeoShapeRepository geoShapeRepository;

  public GeoShapeService(GeoShapeRepository geoShapeRepository) {
    this.geoShapeRepository = geoShapeRepository;
  }

  @Transactional
  public UUID addGeoShape(String title, MultipartFile file) throws IOException {
    try (InputStream inputStream = file.getInputStream()) {
      String geoJson =
          new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))
              .lines()
              .collect(Collectors.joining("\n"));
      GeoJsonHandler.validateGeoJson(geoJson);
      GeoShape geoShape = new GeoShape();
      geoShape.setTitle(title);
      geoShape.setStatus(GeoShapeStatus.ACTIVE);
      geoShape.setGeoJson(geoJson);
      return geoShapeRepository.save(geoShape).getExternalId();
    }
  }

  @Transactional(readOnly = true)
  public GetGeoShapesResponse getGeoShapes(
      GeoShapeSortKey sortKey,
      SortDirection sortDirection,
      Integer page,
      Integer pageSize,
      boolean onlyActive) {
    PageRequest pageRequest =
        PageRequest.of(
            page,
            pageSize,
            Sort.by(
                StatisticMapper.mapSortDirection(sortDirection),
                mapSortKey(sortKey),
                BaseEntity_.ID));
    Page<GeoShape> geoShapePage;
    if (onlyActive) {
      geoShapePage = geoShapeRepository.findAllByStatus(GeoShapeStatus.ACTIVE, pageRequest);
    } else {
      geoShapePage = geoShapeRepository.findAll(pageRequest);
    }

    return new GetGeoShapesResponse(
        geoShapePage.get().map(GeoShapeService::mapToGeoShapeMetaInfo).toList(),
        geoShapePage.getTotalElements());
  }

  private static GeoShapeMetaInfo mapToGeoShapeMetaInfo(GeoShape geoShape) {
    return new GeoShapeMetaInfo(
        geoShape.getExternalId(),
        geoShape.getTitle(),
        mapStatusDto(geoShape),
        geoShape.getCreatedAt());
  }

  private static GeoShapeStatusDto mapStatusDto(GeoShape geoShape) {
    return GeoShapeStatusDto.valueOf(geoShape.getStatus().name());
  }

  private static String mapSortKey(GeoShapeSortKey sortKey) {
    return switch (sortKey) {
      case TITLE -> GeoShape_.TITLE;
      case CREATED_AT -> GeoShape_.CREATED_AT;
    };
  }

  @Transactional(readOnly = true)
  public GeoShapeDto getGeoShape(UUID geoShapeId) {
    GeoShape geoShape = getGeoShapeInternal(geoShapeId);

    return new GeoShapeDto(
        geoShape.getExternalId(),
        geoShape.getTitle(),
        mapStatusDto(geoShape),
        geoShape.getCreatedAt(),
        geoShape.getGeoJson());
  }

  public GeoShape getGeoShapeInternal(UUID geoShapeId) {
    return geoShapeRepository
        .findByExternalId(geoShapeId)
        .orElseThrow(
            () -> new NotFoundException("GeoShape with id '%s' not found".formatted(geoShapeId)));
  }

  @Transactional
  public GeoShapeMetaInfo changeGeoShape(
      UUID geoShapeId, AbstractGeoShapeChangeRequest geoShapeChangeRequest) {
    GeoShape geoShape = getGeoShapeInternal(geoShapeId);
    switch (geoShapeChangeRequest) {
      case GeoShapeChangeStatusRequest changeStatusRequest ->
          geoShape.setStatus(GeoShapeStatus.valueOf(changeStatusRequest.status().name()));
      case GeoShapeChangeTitleRequest changeTitleRequest ->
          geoShape.setTitle(changeTitleRequest.title());
    }

    return mapToGeoShapeMetaInfo(geoShape);
  }

  @Transactional
  public void deleteGeoShape(UUID geoShapeId) {
    GeoShape geoShape = getGeoShapeInternal(geoShapeId);
    geoShapeRepository.delete(geoShape);
  }
}
