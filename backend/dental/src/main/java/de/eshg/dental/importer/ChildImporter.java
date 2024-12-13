/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.importer;

import static de.eshg.lib.xlsximport.ImportStatus.IMPORTED_SUCCESSFULLY;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.dental.ChildService;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportStatus;
import de.eshg.lib.xlsximport.Importer;
import de.eshg.lib.xlsximport.RowReader;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.apache.poi.xssf.usermodel.XSSFSheet;

public class ChildImporter extends Importer<ChildRow, ChildColumn> {

  private final UUID institutionId;
  private final Year year;
  private final ChildService childService;

  public ChildImporter(
      XSSFSheet sheet,
      RowReader<ChildRow, ChildColumn> rowReader,
      FeedbackColumnAccessor feedbackColumnAccessor,
      UUID institutionId,
      Year year,
      ChildService childService) {
    super(sheet, rowReader, feedbackColumnAccessor);
    this.institutionId = institutionId;
    this.year = year;
    this.childService = childService;
  }

  @Override
  protected void evaluateActionsForRows(List<ChildRow> rows) {
    List<UUID> existingChildIds = fetchExistingChildIdsIfNecessary(rows);
    Map<PersonKeyAttributes, Child> existingChildrenInAsset = findExistingChildrenInAsset(rows);

    for (ChildRow row : rows) {
      evaluateActionForRow(row, existingChildIds, existingChildrenInAsset);
    }
  }

  private void evaluateActionForRow(
      ChildRow row,
      List<UUID> existingChildIds,
      Map<PersonKeyAttributes, Child> existingChildrenInAsset) {
    if (row.getEntityId() != null) {
      if (existingChildIds.contains(row.getEntityId())) {
        markAsImportedPreviously(row);
      } else {
        markAsInvalidEntityId(row);
      }
    } else if (isDuplicateRow(row)) {
      markAsDuplicateWithinList(row);
    } else if (row.isValid()) {
      evaluateActionForValidRow(row, existingChildrenInAsset);
    } else {
      markAsInputDataError(row);
    }
  }

  private void evaluateActionForValidRow(
      ChildRow row, Map<PersonKeyAttributes, Child> existingChildrenInAsset) {
    Child existingChild = existingChildrenInAsset.get(row.getChildKeyAttributes());
    if (existingChild != null) {
      writeStatusAndEntityId(row, ImportStatus.DUPLICATE_IN_ASSET, existingChild.getExternalId());
      stats.countDuplicated();
    } else {
      addToImportableRows(row);
      stats.countCreated();
    }
  }

  private List<UUID> fetchExistingChildIdsIfNecessary(List<ChildRow> rows) {
    List<UUID> childIds =
        rows.stream().map(ChildRow::getEntityId).filter(Objects::nonNull).toList();
    return childService.collectExistingChildIds(childIds);
  }

  @Override
  protected void createEntitiesAndWriteResults(List<ChildRow> importableRows) {
    Map<ChildRow, CreateChildRequest> requestsPerRow =
        importableRows.stream()
            .map(
                importableRow -> {
                  CreateChildRequest request =
                      ChildMapper.mapImportDataToCreateChildRequest(
                          importableRow.getChild(), institutionId, year);
                  return Map.entry(importableRow, request);
                })
            .collect(StreamUtil.toLinkedHashMap(Map.Entry::getKey, Map.Entry::getValue));

    Map<CreateChildRequest, Child> result =
        childService.createChildren(new ArrayList<>(requestsPerRow.values()), DataOriginDto.IMPORT);

    requestsPerRow.forEach(
        (importableRow, request) -> {
          Child child = result.get(request);
          writeStatusAndEntityId(importableRow, IMPORTED_SUCCESSFULLY, child.getExternalId());
        });
  }

  private Map<PersonKeyAttributes, Child> findExistingChildrenInAsset(List<ChildRow> rows) {
    Set<PersonKeyAttributes> childKeyAttributes = getChildKeyAttributesOfValidRows(rows);
    return childService.findOpenChildrenWithSamePersonKeyAttributes(childKeyAttributes);
  }

  private Set<PersonKeyAttributes> getChildKeyAttributesOfValidRows(List<ChildRow> rows) {
    return rows.stream()
        .filter(row -> row.getEntityId() == null)
        .filter(ChildRow::isValid)
        .map(ChildRow::getChildKeyAttributes)
        .collect(StreamUtil.toLinkedHashSet());
  }
}
