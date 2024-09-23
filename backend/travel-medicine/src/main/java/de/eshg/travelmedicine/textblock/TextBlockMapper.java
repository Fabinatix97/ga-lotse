/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.textblock;

import de.eshg.base.SortDirection;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockSortKey;
import de.eshg.travelmedicine.textblock.persistence.entity.TextBlock;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class TextBlockMapper {
  public static TextBlockDto toInterfaceType(TextBlock textblock) {
    return new TextBlockDto(textblock.getId(), textblock.getName(), textblock.getContent());
  }

  public static List<TextBlockDto> toInterfaceTypes(List<TextBlock> textBlocks) {
    return textBlocks.stream().map(TextBlockMapper::toInterfaceType).toList();
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
