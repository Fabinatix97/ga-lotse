/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.textblock.mapper;

import de.eshg.base.SortDirection;
import de.eshg.base.util.PaginationUtil;
import de.eshg.inspection.textblock.persistence.TextBlock;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockSortKey;
import java.util.List;
import org.springframework.data.domain.Sort;

public class TextBlockMapper {

  private TextBlockMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static TextBlockDto mapToDto(TextBlock textBlock) {
    return new TextBlockDto(textBlock.getId(), textBlock.getName(), textBlock.getContent());
  }

  public static List<TextBlockDto> mapToDtos(List<TextBlock> textBlocks) {
    return textBlocks.stream().map(TextBlockMapper::mapToDto).toList();
  }

  public static PaginationUtil.PageSpec mapToPageSpec(
      int page, int pageSize, TextBlockSortKey sortKey, SortDirection direction) {
    return new PaginationUtil.PageSpec(page, pageSize, mapToSortOrder(sortKey, direction));
  }

  private static Sort.Order mapToSortOrder(TextBlockSortKey sortKey, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortKey(sortKey));
  }

  public static Sort.Direction mapDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case null -> Sort.Direction.ASC;
      case SortDirection.ASC -> Sort.Direction.ASC;
      case SortDirection.DESC -> Sort.Direction.DESC;
    };
  }

  @SuppressWarnings({"java:S1871", "SameReturnValue"}) // more cases will be added later
  private static String mapSortKey(TextBlockSortKey sortKey) {
    return switch (sortKey) {
      case null -> "name";
      case TextBlockSortKey.NAME -> "name";
    };
  }
}
