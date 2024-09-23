/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.inventory.persistence;

import static de.eshg.base.util.PaginationUtil.getPageable;
import static de.eshg.base.util.SearchSpecificationUtil.*;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.inventory.InventoryMapper;
import de.eshg.base.inventory.api.UpdateInventoryItemRequest;
import de.eshg.base.inventory.persistence.entity.*;
import de.eshg.base.inventory.persistence.repository.InventoryBookingRepository;
import de.eshg.base.inventory.persistence.repository.InventoryRepository;
import de.eshg.base.label.persistence.LabelService;
import de.eshg.base.label.persistence.entity.Label;
import de.eshg.base.label.persistence.entity.Label_;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.ws.rs.NotFoundException;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

  private static final String AUDITLOG_CATEGORY = "Inventar";
  public static final String RELEVANCE_SORT_KEY = "RELEVANCE";

  private final InventoryRepository inventoryRepository;
  private final InventoryBookingRepository inventoryBookingRepository;
  private final EntityManager entityManager;
  private final LabelService labelService;
  private final AuditLogger auditLogger;

  public InventoryService(
      InventoryRepository inventoryRepository,
      InventoryBookingRepository inventoryBookingRepository,
      EntityManager entityManager,
      LabelService labelService,
      AuditLogger auditLogger) {
    this.inventoryRepository = inventoryRepository;
    this.inventoryBookingRepository = inventoryBookingRepository;
    this.entityManager = entityManager;
    this.labelService = labelService;
    this.auditLogger = auditLogger;
  }

  private Specification<InventoryItem> containsNameOrHasNameFuzzy(String name) {
    if (name == null || name.isEmpty()) {
      return (root, query, builder) -> builder.and();
    }
    configureSimilarityThreshold(name);
    return (root, query, builder) ->
        builder.or(
            containsNormalized(builder, root.get(InventoryItem_.name), splitToWords(name)),
            builder.isTrue(
                isSimilar(builder, builder.literal(name), root.get(InventoryItem_.name))));
  }

  private void configureSimilarityThreshold(String name) {
    double threshold = getSimilarityThreshold(name);
    entityManager
        .createNativeQuery("set local pg_trgm.similarity_threshold=" + threshold)
        .executeUpdate();
  }

  private static Specification<InventoryItem> hasType(InventoryItemType type) {
    if (type == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(InventoryItem_.type), type);
  }

  private Specification<InventoryItem> hasLabel(String label) {
    if (label == null || label.isEmpty()) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, builder) ->
        builder.equal(root.join(InventoryItem_.labels).get(Label_.name), label);
  }

  public Page<InventoryItem> findAll(
      String name, InventoryItemType itemType, String label, PageSpec pageSpec) {
    Specification<InventoryItem> specification =
        Specification.allOf(containsNameOrHasNameFuzzy(name), hasType(itemType), hasLabel(label));
    if (RELEVANCE_SORT_KEY.equals(pageSpec.order().getProperty())) {
      specification = Specification.allOf(specification, orderBySimilarity(name));
      return inventoryRepository.findAll(
          specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    } else {
      Pageable pageable = getPageable(pageSpec, InventoryItem_.NAME);
      return inventoryRepository.findAll(specification, pageable);
    }
  }

  private static Specification<InventoryItem> orderBySimilarity(String name) {
    return (root, query, cb) -> {
      query.orderBy(cb.desc(similarity(cb, name, root.get(InventoryItem_.name))));
      return cb.and();
    };
  }

  public Optional<InventoryItem> findById(UUID id) {
    return inventoryRepository.findById(id);
  }

  public InventoryItem findByIdOrThrow(UUID id) {
    return findById(id)
        .orElseThrow(
            () -> new de.eshg.rest.service.error.NotFoundException("InventoryItem not found"));
  }

  public InventoryItem findAndLockByIdOrThrow(UUID id) {
    return findById(id)
        .map(
            item -> {
              entityManager.lock(item, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
              return item;
            })
        .orElseThrow(
            () -> new de.eshg.rest.service.error.NotFoundException("InventoryItem not found"));
  }

  public void correctCount(UUID id, long version, int newCount) {
    InventoryItem item = findAndLockByIdOrThrow(id);
    ValidationUtil.validateVersion(version, item);

    item.setCount(newCount);
    InventoryItemBooking booking = new InventoryItemBooking();
    booking.setStatus(InventoryBookingStatus.ACTIVE);
    booking.setType(InventoryBookingType.CORRECTION);
    booking.setInventoryItem(item);
    booking.setAmount(newCount);
    booking.setOwnerKey(UUID.randomUUID());
    InventoryItemBooking saved = inventoryBookingRepository.save(booking);
    writeAuditLog("Inventur", mapAuditLog(saved));
  }

  @Transactional
  public InventoryItemBooking book(UUID id, int amount) {
    InventoryItem item = findAndLockByIdOrThrow(id);
    try {
      int count = Math.subtractExact(item.getCount(), amount);
      if (count < 0) {
        throw new BadRequestException(
            ErrorCode.DATA_INTEGRITY_VIOLATION,
            "Not enough stock, bookingCount exceed count of Item");
      }
      item.setCount(count);
    } catch (ArithmeticException e) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "Not enough stock, bookingCount exceed count of Item");
    }
    InventoryItemBooking booking = new InventoryItemBooking();
    booking.setStatus(InventoryBookingStatus.ACTIVE);
    booking.setType(InventoryBookingType.BOOKING);
    booking.setInventoryItem(item);
    booking.setAmount(amount);
    booking.setOwnerKey(UUID.randomUUID());
    InventoryItemBooking saved = inventoryBookingRepository.save(booking);
    writeAuditLog("Buchen", mapAuditLog(saved));
    return saved;
  }

  @Transactional
  public InventoryItemBooking restock(UUID id, int amount) {
    InventoryItem item = findAndLockByIdOrThrow(id);
    try {
      item.setCount(Math.addExact(item.getCount(), amount));
    } catch (ArithmeticException e) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION, "Restocked count exceeds limit");
    }
    InventoryItemBooking booking = new InventoryItemBooking();
    booking.setStatus(InventoryBookingStatus.ACTIVE);
    booking.setType(InventoryBookingType.DELIVERY);
    booking.setInventoryItem(item);
    booking.setAmount(amount);
    booking.setOwnerKey(UUID.randomUUID());
    InventoryItemBooking saved = inventoryBookingRepository.save(booking);
    writeAuditLog("Auffüllen", mapAuditLog(saved));
    return saved;
  }

  public InventoryItemBooking findBookingByIdOrThrow(UUID inventoryId, long bookingId) {
    return inventoryBookingRepository
        .findByInventoryItemIdAndId(inventoryId, bookingId)
        .orElseThrow(
            () -> new de.eshg.rest.service.error.NotFoundException("Booking entry not found"));
  }

  @Transactional
  public InventoryItemBooking cancelBooking(UUID inventoryId, long bookingId, UUID ownerKey) {
    InventoryItemBooking booking = findBookingByIdOrThrow(inventoryId, bookingId);
    if (booking.getStatus() == InventoryBookingStatus.CANCELLED) {
      return booking;
    }

    if (booking.getType() != InventoryBookingType.BOOKING) {
      throw new BadRequestException("Cannot cancel an entry of type " + booking.getType());
    }

    if (ownerKey == null) {
      if (CurrentUserHelper.currentUserHasNoRole(
          EmployeePermissionRole.BASE_INVENTORY_ADMINISTRATE)) {
        throw new BadRequestException("Missing owner key");
      }
    } else {
      if (!ownerKey.equals(booking.getOwnerKey())) {
        throw new BadRequestException("Invalid owner key");
      }
    }

    entityManager.lock(booking.getInventoryItem(), LockModeType.OPTIMISTIC_FORCE_INCREMENT);

    booking.setStatus(InventoryBookingStatus.CANCELLED);
    try {
      booking
          .getInventoryItem()
          .setCount(Math.addExact(booking.getInventoryItem().getCount(), booking.getAmount()));
    } catch (ArithmeticException e) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION, "Restocked count exceeds limit");
    }

    inventoryBookingRepository.save(booking);
    writeAuditLog("Buchung stornieren", mapAuditLog(booking));
    return booking;
  }

  public Page<InventoryItemBooking> getBookingHistory(
      InventoryItem item, Integer pageNumber, Integer pageSize) {
    Pageable pageable =
        PageRequest.of(
            pageNumber == null ? 0 : pageNumber,
            pageSize == null ? 25 : pageSize,
            Sort.by(InventoryItemBooking_.ID).descending());
    return inventoryBookingRepository.findAllByInventoryItem(item, pageable);
  }

  public InventoryItem addInventoryItem(InventoryItem item) {
    if (inventoryRepository.existsByName(item.getName())) {
      throw new AlreadyExistsException(
          "Inventory item with name `%s` already exists".formatted(item.getName()));
    }
    InventoryItem saved = inventoryRepository.save(item);
    writeAuditLog("Anlegen", mapAuditLog(saved));
    return saved;
  }

  public InventoryItem update(UUID id, UpdateInventoryItemRequest request) {
    InventoryItem item = inventoryRepository.findById(id).orElseThrow(NotFoundException::new);
    item.setName(request.name());
    item.setType(InventoryMapper.mapInventoryItemTypeToDm(request.type()));
    item.setMinCount(request.minCount());
    item.setArticleNumber(request.articleNumber());
    item.setDescription(request.description());

    if (request.labelNames() != null) {
      assignLabelsToInventoryItem(item, request.labelNames());
    }

    InventoryItem saved = inventoryRepository.save(item);
    writeAuditLog("Editieren", mapAuditLog(saved));
    return saved;
  }

  public void assignLabelsToInventoryItem(InventoryItem inventoryItem, List<String> labelNames) {
    Set<Label> labels =
        labelNames.stream().map(labelService::getOrAdd).collect(StreamUtil.toLinkedHashSet());
    inventoryItem.setLabels(labels);
  }

  private void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log(AUDITLOG_CATEGORY, operationName, attributes);
  }

  private Map<String, String> mapAuditLog(InventoryItem item) {
    return Map.of("Inventar ID", item.getExternalId().toString());
  }

  private Map<String, String> mapAuditLog(InventoryItemBooking booking) {
    return Map.of(
        "Inventar ID", booking.getInventoryItem().getExternalId().toString(),
        "Buchung ID", String.valueOf(booking.getId()));
  }
}
