/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist;

import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.packlist.api.GetPacklistsResponse;
import de.eshg.inspection.packlist.api.PacklistDto;
import de.eshg.inspection.packlist.mapper.PacklistDtoMapper;
import de.eshg.inspection.packlist.mapper.PacklistEntityMapper;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlist.persistence.PacklistElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import org.springframework.stereotype.Service;

@Service
public class PacklistService {

  public static Packlist createPacklist(
      PacklistDefinitionRevision revision, Inspection inspection) {
    Packlist packlist = new Packlist();
    packlist.setInspection(inspection);
    packlist.setPacklistDefinitionRevision(revision);
    revision
        .getElements()
        .forEach(element -> packlist.addElement(PacklistEntityMapper.newEntityFrom(element)));
    return packlist;
  }

  public GetPacklistsResponse getPacklists(Inspection inspection) {
    return PacklistDtoMapper.dtoFrom(inspection.getPacklists());
  }

  public PacklistDto checkPacklistElement(PacklistElement packlistElement, boolean checked) {
    packlistElement.setChecked(checked);
    return PacklistDtoMapper.dtoFrom(packlistElement.getPacklist());
  }
}
