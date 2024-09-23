/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.util;

import static java.util.Arrays.asList;
import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;

import de.eshg.rest.service.error.BadRequestException;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

public final class PageRequestUtil {

  private PageRequestUtil() {}

  /**
   * Create a PageRequest object from parameters.
   *
   * <p>Example:
   *
   * <pre>
   *   PageRequest pageRequest = PageRequestUtil.createPageRequest(pageNumber, pageSize,
   *       List.of("postalCode,asc", "name,desc"),
   *       "name,asc",
   *       "postalCode", "name");
   * </pre>
   *
   * @param pageNumber the page number, nullable, default 0
   * @param pageSize the page size, nullable, default 25
   * @param sort optional list of sort parameters in the form {@code <paramName>[,asc|desc]}
   * @param allowedSortParamNames allowed list of paramNames to use in {@code sort} and {@code
   *     defaultSort}. For an unknown paramName a BadRequestException is thrown
   * @return new {@link PageRequest} instance
   */
  public static PageRequest createPageRequest(
      @Nullable Integer pageNumber,
      @Nullable Integer pageSize,
      @Nullable List<String> sort,
      String... allowedSortParamNames) {
    List<Sort.Order> orders = createSortOrders(sort, Set.copyOf(asList(allowedSortParamNames)));
    return PageRequest.of(
        pageNumber == null ? 0 : pageNumber, pageSize == null ? 25 : pageSize, Sort.by(orders));
  }

  private static List<Order> createSortOrders(
      List<String> sort, Set<String> allowedSortParamNames) {
    if (sort == null || sort.isEmpty()) {
      return List.of();
    }
    return sort.stream().map(s -> parseSortParam(s, allowedSortParamNames)).toList();
  }

  private static Order parseSortParam(String s, Set<String> allowedSortParamNames) {
    String[] split = s.split("[,|]");
    String paramName = split[0];
    if (!allowedSortParamNames.contains(paramName))
      throw new BadRequestException("invalid sort param: " + paramName);
    Sort.Direction direction = split.length < 2 || "asc".equalsIgnoreCase(split[1]) ? ASC : DESC;
    return new Order(direction, paramName);
  }
}
