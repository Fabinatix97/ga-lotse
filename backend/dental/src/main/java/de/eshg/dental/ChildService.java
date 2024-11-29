/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.lib.xlsximport.ImportValidator.validateFileExistsAndHasCorrectType;
import static de.eshg.lib.xlsximport.ImportValidator.validateHeaderExists;
import static de.eshg.lib.xlsximport.ImportValidator.validateNumberOfRows;
import static de.eshg.lib.xlsximport.ImportValidator.validateSheet;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.ChildSortKey;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.config.DentalProperties;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.importer.DentalColumn;
import de.eshg.dental.importer.DentalImporter;
import de.eshg.dental.importer.DentalRowReader;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.dental.util.ChildPageSpec;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.rest.service.error.NotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ChildService {

  private final ChildRepository childRepository;
  private final PersonApi personApi;
  private final ContactClient contactClient;
  private final DentalProperties dentalProperties;
  private final PersonClient personClient;

  public ChildService(
      ChildRepository childRepository,
      PersonApi personApi,
      ContactClient contactClient,
      DentalProperties dentalProperties,
      PersonClient personClient) {
    this.childRepository = childRepository;
    this.personApi = personApi;
    this.contactClient = contactClient;
    this.dentalProperties = dentalProperties;
    this.personClient = personClient;
  }

  public Child createChild(CreateChildRequest request) {
    Child child = new Child();
    child.setChildIdFromCentralFile(addChild(request));
    ChildMapper.mapToChild(request, child);
    return childRepository.save(child);
  }

  private UUID addChild(CreateChildRequest request) {
    AddPersonFileStateResponse response =
        personApi.addPersonFileState(
            new AddPersonFileStateRequest(
                new PersonDetailsDto(
                    request.gender(),
                    request.firstName(),
                    request.lastName(),
                    request.dateOfBirth()),
                DataOriginDto.MANUAL));
    return response.id();
  }

  ChildWithAugmentedData findAndAugmentByExternalId(UUID childId) {
    Child child =
        childRepository
            .findByExternalId(childId)
            .orElseThrow(
                () -> new NotFoundException("Child with UUID %s not found".formatted(childId)));
    return augmentWithDetails(child);
  }

  ChildWithAugmentedData createExaminationForChild(ExaminationDto request, UUID childId) {
    Child child = findByExternalIdForUpdate(childId);
    Examination examination = new Examination();
    examination.setExaminationDate(request.examinationDate());
    examination.setNote(request.note());
    child.addExamination(examination);
    return augmentWithDetails(child);
  }

  private Child findByExternalIdForUpdate(UUID childId) {
    return childRepository
        .findByExternalIdForUpdate(childId)
        .orElseThrow(
            () -> new NotFoundException("Child with UUID %s not found".formatted(childId)));
  }

  private ChildWithAugmentedData augmentWithDetails(Child child) {
    GetPersonFileStateResponse person =
        personApi.getPersonFileState(child.getChildIdFromCentralFile());
    ContactDto contact = contactClient.getContact(child.getInstitutionId());

    return new ChildWithAugmentedData(child, person, contact);
  }

  public Page<ChildWithAugmentedData> getChildren(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters) {
    ChildSpecification childSpecification =
        new ChildSpecification(filterParameters, paginationAndSortParameters);
    ChildPageSpec pageSpec = ChildSpecification.toPageSpec(paginationAndSortParameters);
    Page<Child> page;
    boolean sortKeyIsPersonAttribute =
        Optional.ofNullable(paginationAndSortParameters.sortKey())
            .map(ChildSortKey::isPersonAttribute)
            .orElse(false);
    if (sortKeyIsPersonAttribute) {
      page = getChildrenWithPersonAttributeSortKey(paginationAndSortParameters, childSpecification);
    } else {
      page =
          childRepository.findAll(
              childSpecification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    }

    Map<UUID, GetPersonFileStateResponse> persons =
        personClient.fetchPersonDataInBulk(page.toList()).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
    Map<UUID, ContactDto> contacts = fetchContactsInBulk(page);

    return page.map(
        child -> {
          GetPersonFileStateResponse person = persons.get(child.getChildIdFromCentralFile());
          Assert.notNull(
              person, () -> "Failed to resolve child " + child.getChildIdFromCentralFile());
          ContactDto contact = contacts.get(child.getInstitutionId());
          Assert.notNull(contact, () -> "Failed to resolve contact " + child.getInstitutionId());
          return new ChildWithAugmentedData(child, person, contact);
        });
  }

  private Map<UUID, ContactDto> fetchContactsInBulk(Streamable<Child> children) {
    List<UUID> institutionIds = children.map(Child::getInstitutionId).stream().distinct().toList();
    return contactClient.getBulkContacts(institutionIds, Function.identity());
  }

  public ImportResult importChildrenFromFile(MultipartFile file, UUID institutionId, int schoolYear)
      throws IOException {

    validateFileExistsAndHasCorrectType(file);

    try (InputStream inputStream = file.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {

      validateSheet(workbook);
      Sheet sheet = workbook.getSheetAt(0);

      validateNumberOfRows(sheet, dentalProperties.getMaxNumberOfImportRows());
      validateHeaderExists(sheet);

      try (XlsxNormalizer xlsxNormalizer = new XlsxNormalizer()) {
        XSSFSheet normalizedSheet = xlsxNormalizer.normalize(sheet);

        List<DentalColumn> actualColumns =
            ImportValidator.validateHeaderFormat(DentalColumn.values(), normalizedSheet);
        DentalImporter importer =
            new DentalImporter(
                normalizedSheet,
                new DentalRowReader(normalizedSheet, actualColumns),
                new FeedbackColumnAccessor(actualColumns, DentalColumn.CHILD_ID.getHeader()),
                institutionId,
                schoolYear,
                this);
        return importer.process();
      }
    }
  }

  private Page<Child> getChildrenWithPersonAttributeSortKey(
      ChildPaginationAndSortParameters paginationAndSortParameters,
      ChildSpecification childSpecification) {
    List<Child> allChildren = childRepository.findAll(childSpecification);
    List<UUID> pagedAndSortedFileStateIds =
        personClient
            .fetchPersonDataInBulk(
                allChildren,
                new GetPersonFileStatesSortParameters(
                    paginationAndSortParameters.sortKey().asPersonsSortKey(),
                    paginationAndSortParameters.sortDirectionOrFallback(SortDirection.ASC),
                    paginationAndSortParameters.pageNumberOrFallback(0),
                    paginationAndSortParameters.pageSizeOrFallback(10)))
            .stream()
            .map(GetPersonFileStateResponse::id)
            .toList();
    List<Child> result =
        childRepository
            .findByCentralFileStateIds(pagedAndSortedFileStateIds)
            .sorted(
                Comparator.comparingInt(
                    child -> {
                      int index =
                          pagedAndSortedFileStateIds.indexOf(child.getChildIdFromCentralFile());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    }))
            .toList();

    return new PageImpl<>(result, Pageable.ofSize(result.size()), allChildren.size());
  }
}
