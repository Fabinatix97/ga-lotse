/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.api;

import static java.lang.String.CASE_INSENSITIVE_ORDER;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsLast;
import static org.springframework.util.CollectionUtils.isEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.inspection.util.PageRequestUtil;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Order;
import org.springframework.web.util.UriUtils;

@Schema(name = "GetPendingFacilitiesPaginationOptions")
public record GetPendingFacilitiesPaginationOptionsDto(
    @Schema(defaultValue = "0", type = "integer") @Min(0) @Max(200) Integer pageNumber,
    @Schema(defaultValue = "25", type = "integer") @Min(1) @Max(2000) Integer pageSize,
    @Parameter(
            description = "list of sort criteria",
            example = "?sort=postalCode|asc&sort=status|desc")
        List<String> sort) {

  private static final List<String> DEFAULT_SORT = List.of("plannedFrom|asc", "name|asc");

  @JsonIgnore
  public PageRequest getPageRequest() {
    return PageRequestUtil.createPageRequest(
        pageNumber,
        pageSize,
        isEmpty(sort) ? DEFAULT_SORT : sort.stream().map(s -> UriUtils.decode(s, UTF_8)).toList(),
        "plannedFrom",
        "kind",
        "name",
        "postalCode",
        "city",
        "street",
        "objectTypeId",
        "objecttype_name",
        "inspection_status",
        "inspection_type",
        "inspection_phase",
        "inspection_numberOfIncidents");
  }

  public static Comparator<InspPendingFacilityDto> createComparator(PageRequest pageRequest) {
    Comparator<InspPendingFacilityDto> comparator = null;
    for (Order order : pageRequest.getSort()) {
      Comparator<InspPendingFacilityDto> next =
          switch (order.getProperty()) {
            case "plannedFrom" ->
                comparing(
                    e -> e.plannedFrom() == null ? null : e.plannedFrom(),
                    nullsLast(naturalOrder()));
            case "kind" ->
                comparing(e -> e.kind() == null ? null : e.kind(), nullsLast(naturalOrder()));
            case "name" -> comparing(InspPendingFacilityDto::name, CASE_INSENSITIVE_ORDER);
            case "postalCode" -> comparing(InspPendingFacilityDto::postalCode);
            case "city" -> comparing(InspPendingFacilityDto::city, CASE_INSENSITIVE_ORDER);
            case "street" -> comparing(InspPendingFacilityDto::street, CASE_INSENSITIVE_ORDER);
            case "objectTypeId" -> comparing(e -> e.objecttype().name(), CASE_INSENSITIVE_ORDER);
            case "objecttype_name" ->
                comparing(
                    e -> e.objecttype() == null ? null : e.objecttype().name(),
                    nullsLast(CASE_INSENSITIVE_ORDER));
            case "inspection_status" ->
                comparing(
                    e -> e.inspection() == null ? null : e.inspection().status(),
                    nullsLast(naturalOrder()));
            case "inspection_type" ->
                comparing(
                    e -> e.inspection() == null ? null : e.inspection().type(),
                    nullsLast(naturalOrder()));
            case "inspection_phase" ->
                comparing(
                    e -> e.inspection() == null ? null : e.inspection().phase(),
                    nullsLast(naturalOrder()));
            case "inspection_numberOfIncidents" ->
                comparing(
                    e -> e.inspection() == null ? null : e.inspection().numberOfIncidents(),
                    nullsLast(naturalOrder()));
            default -> throw new BadRequestException("invalid sort param: " + order.getProperty());
          };
      if (order.isDescending()) {
        next = next.reversed();
      }
      comparator = comparator == null ? next : comparator.thenComparing(next);
    }
    return comparator;
  }
}
