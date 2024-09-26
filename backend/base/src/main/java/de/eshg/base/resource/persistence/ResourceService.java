/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.persistence;

import static de.eshg.base.util.PaginationUtil.getPageable;
import static de.eshg.base.util.SearchSpecificationUtil.*;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.CalendarService;
import de.eshg.base.label.persistence.LabelService;
import de.eshg.base.label.persistence.entity.Label;
import de.eshg.base.label.persistence.entity.Label_;
import de.eshg.base.resource.api.UpdateResourceRequest;
import de.eshg.base.resource.persistence.entity.Resource;
import de.eshg.base.resource.persistence.entity.ResourceType;
import de.eshg.base.resource.persistence.entity.Resource_;
import de.eshg.base.resource.persistence.repository.ResourceRepository;
import de.eshg.base.util.FuzzySearchHelper;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {

  public static final String RELEVANCE_SORT_KEY = "RELEVANCE";

  private final ResourceRepository resourceRepository;
  private final LabelService labelService;
  private final CalendarService calendarService;
  private final FuzzySearchHelper fuzzySearchHelper;
  private final AuditLogger auditLogger;

  public ResourceService(
      ResourceRepository resourceRepository,
      LabelService labelService,
      CalendarService calendarService,
      FuzzySearchHelper fuzzySearchHelper,
      AuditLogger auditLogger) {
    this.resourceRepository = resourceRepository;
    this.calendarService = calendarService;
    this.fuzzySearchHelper = fuzzySearchHelper;
    this.auditLogger = auditLogger;
    this.labelService = labelService;
  }

  private static Specification<Resource> hasType(ResourceType type) {
    if (type == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(Resource_.type), type);
  }

  private Specification<Resource> containsNameOrHasNameFuzzy(String name) {
    if (name == null || name.isEmpty()) {
      return (root, query, builder) -> builder.and();
    }
    fuzzySearchHelper.setSimilarityThreshold(getSimilarityThreshold(name));
    return (root, query, builder) ->
        builder.or(
            containsNormalized(builder, root.get(Resource_.name), splitToWords(name)),
            builder.isTrue(isSimilar(builder, builder.literal(name), root.get(Resource_.name))));
  }

  private Specification<Resource> hasLabel(String label) {
    if (label == null || label.isEmpty()) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, builder) ->
        builder.equal(root.join(Resource_.labels).get(Label_.name), label);
  }

  public Page<Resource> findAll(
      String name, ResourceType resourceType, String label, PageSpec pageSpec) {
    Specification<Resource> specification =
        Specification.allOf(
            containsNameOrHasNameFuzzy(name), hasType(resourceType), hasLabel(label));
    if (RELEVANCE_SORT_KEY.equals(pageSpec.order().getProperty())) {
      specification = Specification.allOf(specification, orderBySimilarity(name));
      return resourceRepository.findAll(
          specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    } else {
      Pageable pageable = getPageable(pageSpec, Resource_.NAME);
      return resourceRepository.findAll(specification, pageable);
    }
  }

  private static Specification<Resource> orderBySimilarity(String name) {
    return (root, query, cb) -> {
      query.orderBy(cb.desc(similarity(cb, name, root.get(Resource_.name))));
      return cb.and();
    };
  }

  public Optional<Resource> findById(UUID id) {
    return resourceRepository.findById(id);
  }

  public Resource findByIdOrThrow(UUID id) {
    return findById(id).orElseThrow(() -> new NotFoundException("Resource not found"));
  }

  public Resource addResource(Resource resource, List<String> labelNames) {
    if (resourceRepository.existsByName(resource.getName())) {
      throw new AlreadyExistsException(
          "Resource with name `%s` already exists".formatted(resource.getName()));
    }

    if (labelNames != null) {
      assignLabelsToResource(resource, labelNames);
    }

    Resource saved = resourceRepository.save(resource);
    calendarService.addResourceCalendar(resource.getId());
    writeAuditLog("Anlegen", mapAuditLog(saved));
    return saved;
  }

  public Resource updateResource(UUID id, UpdateResourceRequest request) {
    Resource resource = findByIdOrThrow(id);
    resource.setName(request.name());
    resource.setDescription(request.description());
    resource.setArticleNumber(request.articleNumber());

    if (request.labelNames() != null) {
      assignLabelsToResource(resource, request.labelNames());
    }

    Resource saved = resourceRepository.save(resource);
    writeAuditLog("Editieren", mapAuditLog(saved));
    return saved;
  }

  private void assignLabelsToResource(Resource resource, List<String> labelNames) {
    Set<Label> labels =
        labelNames.stream().map(labelService::getOrAdd).collect(StreamUtil.toLinkedHashSet());
    resource.setLabels(labels);
  }

  private void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log("Ressourcen", operationName, attributes);
  }

  private Map<String, String> mapAuditLog(Resource resource) {
    return Map.of("ID", resource.getExternalId().toString());
  }
}
