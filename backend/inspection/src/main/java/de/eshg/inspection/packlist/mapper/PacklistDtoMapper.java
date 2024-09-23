/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist.mapper;

import de.eshg.inspection.packlist.api.GetPacklistsResponse;
import de.eshg.inspection.packlist.api.PacklistDto;
import de.eshg.inspection.packlist.api.PacklistElementDto;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlist.persistence.PacklistElement;
import java.util.List;

public class PacklistDtoMapper {

  private PacklistDtoMapper() {}

  public static GetPacklistsResponse dtoFrom(List<Packlist> packlists) {
    return new GetPacklistsResponse(packlists.stream().map(PacklistDtoMapper::dtoFrom).toList());
  }

  public static PacklistDto dtoFrom(Packlist packlist) {
    return new PacklistDto(
        packlist.getId(),
        packlist.getPacklistDefinitionRevision().getId(),
        packlist.getElements().stream().map(PacklistDtoMapper::dtoFrom).toList());
  }

  public static PacklistElementDto dtoFrom(PacklistElement packlistElement) {
    return new PacklistElementDto(
        packlistElement.getId(),
        packlistElement.isChecked(),
        packlistElement.getPacklistDefinitionElement().getText());
  }
}
