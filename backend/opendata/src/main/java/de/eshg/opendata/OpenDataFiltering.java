/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import static de.eshg.domain.model.BaseEntity_.id;
import static de.eshg.opendata.VersionFilterSpecification.filterForOnlyMostRecentMinorVersions;
import static de.eshg.opendata.VersionFilterSpecification.filterVersions;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static org.springframework.data.domain.PageRequest.ofSize;

import de.eshg.domain.model.BaseEntity;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.opendata.api.GetOpenDocumentsPaginationOptions;
import de.eshg.opendata.api.GetOpenDocumentsRequest;
import de.eshg.opendata.api.GetOpenDocumentsResponse;
import de.eshg.opendata.api.ResourceDto;
import de.eshg.opendata.domain.model.Resource;
import de.eshg.opendata.domain.model.Resource_;
import de.eshg.opendata.domain.model.Version;
import de.eshg.opendata.domain.model.Version_;
import de.eshg.opendata.domain.repository.ResourceRepository;
import de.eshg.opendata.domain.repository.VersionRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class OpenDataFiltering {

  private final ResourceRepository resourceRepository;
  private final VersionRepository versionRepository;

  public OpenDataFiltering(
      ResourceRepository resourceRepository, VersionRepository versionRepository) {
    this.resourceRepository = resourceRepository;
    this.versionRepository = versionRepository;
  }

  /** For the employee portal, we paginate based on the resources */
  GetOpenDocumentsResponse getOpenDocumentsFromEmployeePortal(
      GetOpenDocumentsRequest filterOptions, GetOpenDocumentsPaginationOptions paginationOptions) {

    Page<Resource> resourcesToConsider =
        getResourcesToConsiderWithPagination(filterOptions, paginationOptions);
    if (resourcesToConsider.isEmpty()) {
      return new GetOpenDocumentsResponse(
          resourcesToConsider.getTotalPages(), resourcesToConsider.getTotalElements(), List.of());
    }

    Specification<Version> versionSpec =
        getVersionsFromResourcesToConsiderWithFiltering(
                filterOptions, false, resourcesToConsider.getContent())
            .and(eagerlyFetchResources());

    List<ResourceDto> result =
        groupVersionsByResourcesAndMap(versionRepository.findAll(versionSpec));
    return new GetOpenDocumentsResponse(
        resourcesToConsider.getTotalPages(), resourcesToConsider.getTotalElements(), result);
  }

  private Specification<Version> eagerlyFetchResources() {
    return (root, query, criteriaBuilder) -> {
      root.fetch(Version_.resource);
      root.fetch(Version_.sources, JoinType.LEFT);
      return null;
    };
  }

  /**
   * For the citizen portal, we paginate based on the versions and return only the most recent minor
   * version for each major version.
   *
   * <p>Please note that pagination does not work with joint fetch. Hibernate responds with
   * "HHH000104: firstResult/maxResults specified with collection fetch; applying in memory" Thus we
   * use one paginated query to find the relevant versions and one separate query to eagerly fetch
   * the versions together with its resources.
   *
   * <p>https://vladmihalcea.com/fix-hibernate-hhh000104-entity-fetch-pagination-warning-message/
   *
   * <p>https://vladmihalcea.com/hibernate-query-fail-on-pagination-over-collection-fetch/
   */
  GetOpenDocumentsResponse getOpenDocumentsFromCitizenPortal(
      GetOpenDocumentsRequest filterOptions, GetOpenDocumentsPaginationOptions paginationOptions) {

    Specification<Version> versionSpec =
        getVersionsFromResourcesToConsiderWithFiltering(filterOptions, true, null);

    PageRequest pageRequest =
        ofSize(paginationOptions.pageSize()).withPage(paginationOptions.pageNumber());

    Page<Version> paginatedResult = versionRepository.findAll(versionSpec, pageRequest);

    return prepareResult(
        paginatedResult.get(), paginatedResult.getTotalPages(), paginatedResult.getTotalElements());
  }

  private Specification<Version> getVersionsFromResourcesToConsiderWithFiltering(
      GetOpenDocumentsRequest filterOptions,
      boolean returnOnlyMostRecentMinorVersions,
      List<Resource> resourcesToConsider) {

    return Specification.where(
        (root, query, criteriaBuilder) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (resourcesToConsider != null) {
            Set<Long> idsOfResourcesToConsider =
                resourcesToConsider.stream().map(BaseEntity::getId).collect(Collectors.toSet());
            Predicate filterForResourceIdsToConsider =
                root.get(Version_.resource).get(BaseEntity_.id).in(idsOfResourcesToConsider);
            predicates.add(filterForResourceIdsToConsider);
          }

          Predicate commonVersionFilters = filterVersions(filterOptions, criteriaBuilder, root);
          predicates.add(commonVersionFilters);

          if (returnOnlyMostRecentMinorVersions) {
            predicates.add(filterForOnlyMostRecentMinorVersions(root, query, criteriaBuilder));
          }

          query.orderBy(getOrderForResourceAndVersion(root, criteriaBuilder));

          return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        });
  }

  private List<Order> getOrderForResourceAndVersion(
      Path<Version> versionPath, CriteriaBuilder criteriaBuilder) {
    List<Order> orderForResource =
        getOrderForResource(criteriaBuilder, versionPath.get(Version_.resource));

    ArrayList<Order> orders = new ArrayList<>(orderForResource);

    orders.add(criteriaBuilder.desc(versionPath.get(Version_.publicationDate)));
    orders.add(criteriaBuilder.asc(versionPath.get(id)));

    return orders;
  }

  private List<Order> getOrderForResource(
      CriteriaBuilder criteriaBuilder, Path<Resource> resourcePath) {
    return List.of(
        criteriaBuilder.asc(resourcePath.get(Resource_.resourceName)),
        criteriaBuilder.asc(resourcePath.get(id)));
  }

  private GetOpenDocumentsResponse prepareResult(
      Stream<Version> versionStream, int totalPages, long totalElements) {
    List<Version> versionsWithEagerlyFetchedResources =
        versionRepository.findAll(
            Specification.where(
                (root, query, criteriaBuilder) -> {
                  Set<Long> collect =
                      versionStream.map(BaseEntity::getId).collect(Collectors.toSet());
                  root.fetch(Version_.resource);
                  root.fetch(Version_.sources, JoinType.LEFT);

                  query.orderBy(getOrderForResourceAndVersion(root, criteriaBuilder));

                  return root.get(id).in(collect);
                }));

    List<ResourceDto> result = groupVersionsByResourcesAndMap(versionsWithEagerlyFetchedResources);
    return new GetOpenDocumentsResponse(totalPages, totalElements, result);
  }

  private List<ResourceDto> groupVersionsByResourcesAndMap(List<Version> versions) {
    return versions.stream()
        .collect(groupingBy(Version::getResource, LinkedHashMap::new, toList()))
        .entrySet()
        .stream()
        .map(entry -> OpenDataMapper.toInterfaceWithVersions(entry.getKey(), entry.getValue()))
        .toList();
  }

  private Page<Resource> getResourcesToConsiderWithPagination(
      GetOpenDocumentsRequest filterOptions, GetOpenDocumentsPaginationOptions paginationOptions) {
    Specification<Resource> resourceSpec =
        Specification.where(
            (root, query, cb) -> {
              query.distinct(true);
              query.orderBy(getOrderForResource(cb, root));
              return filterVersions(filterOptions, cb, root.join(Resource_.versions));
            });
    PageRequest pageRequest =
        ofSize(paginationOptions.pageSize()).withPage(paginationOptions.pageNumber());

    return resourceRepository.findAll(resourceSpec, pageRequest);
  }
}
