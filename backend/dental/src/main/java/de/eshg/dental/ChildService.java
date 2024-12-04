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
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.config.DentalProperties;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Person;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.importer.DentalColumn;
import de.eshg.dental.importer.DentalImporter;
import de.eshg.dental.importer.DentalRowReader;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.dental.util.ChildPageSpec;
import de.eshg.dental.util.ChildSystemProgressEntryType;
import de.eshg.dental.util.ExceptionUtil;
import de.eshg.dental.util.ProgressEntryUtil;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.ImportValidator;
import de.eshg.lib.xlsximport.XlsxNormalizer;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.validation.ValidationUtil;
import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

  private static final Logger log = LoggerFactory.getLogger(ChildService.class);

  private final Clock clock;
  private final AuditLogger auditLogger;
  private final ChildRepository childRepository;
  private final PersonApi personApi;
  private final ContactClient contactClient;
  private final DentalProperties dentalProperties;
  private final PersonClient personClient;
  private final ProgressEntryUtil progressEntryUtil;

  public ChildService(
      Clock clock,
      AuditLogger auditLogger,
      ChildRepository childRepository,
      PersonApi personApi,
      ContactClient contactClient,
      DentalProperties dentalProperties,
      PersonClient personClient,
      ProgressEntryUtil progressEntryUtil) {
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.childRepository = childRepository;
    this.personApi = personApi;
    this.contactClient = contactClient;
    this.dentalProperties = dentalProperties;
    this.personClient = personClient;
    this.progressEntryUtil = progressEntryUtil;
  }

  public Child createChild(CreateChildRequest request) {
    Child child = new Child();
    child.setProcedureType(ProcedureType.DENTAL_CHILD);
    child.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    Person person = new Person();
    person.setPersonType(Person.PERSON_TYPE_USED_FOR_CHILDREN);
    person.setCentralFileStateId(addChild(request));
    child.addRelatedPerson(person);
    ChildMapper.mapToChild(request, child);
    return childRepository.save(child);
  }

  private UUID addChild(CreateChildRequest request) {
    AddPersonFileStateResponse response =
        personApi.addPersonFileState(
            new AddPersonFileStateRequest(
                request.referenceId(),
                new PersonDetailsDto(
                    request.title(),
                    request.salutation(),
                    request.gender(),
                    request.firstName(),
                    request.lastName(),
                    request.dateOfBirth(),
                    request.nameAtBirth(),
                    request.placeOfBirth(),
                    request.countryOfBirth(),
                    request.emailAddresses(),
                    request.phoneNumbers(),
                    request.contactAddress(),
                    request.differentBillingAddress()),
                DataOriginDto.MANUAL));
    return response.id();
  }

  ChildWithAugmentedData findAndAugmentByExternalId(UUID childId) {
    Child child =
        childRepository
            .findByExternalId(childId)
            .orElseThrow(ExceptionUtil.childNotFoundException(childId));
    return augmentWithDetails(child);
  }

  public ChildWithAugmentedData augmentWithDetails(Child child) {
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
            .findByRelatedPersonsCentralFileStateIds(
                pagedAndSortedFileStateIds, Person.PERSON_TYPE_USED_FOR_CHILDREN)
            .stream()
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

  public List<String> getInstitutionGroups(UUID institutionId) {
    return childRepository.findDistinctInstitutionGroups(institutionId);
  }

  public ChildWithAugmentedData update(UUID childId, UpdateChildRequest request) {
    Child child =
        childRepository
            .findByExternalIdForUpdate(childId)
            .orElseThrow(ExceptionUtil.childNotFoundException(childId));

    ValidationUtil.validateVersion(request.version(), child);

    boolean updateGroup = !Objects.equals(request.groupName(), child.getGroupName());
    if (updateGroup) {
      log.debug("Updating group name: '{}' → '{}'", child.getGroupName(), request.groupName());
      child.setGroupName(request.groupName());
    }

    boolean updateInstitution = !Objects.equals(request.institutionId(), child.getInstitutionId());
    if (updateInstitution) {
      log.debug(
          "Updating institution: '{}' → '{}'", child.getInstitutionId(), request.institutionId());
      child.setInstitutionId(request.institutionId());
    }

    if (updateInstitution) {
      addSystemProgressEntry(child, ChildSystemProgressEntryType.INSTITUTION_MODIFIED);
    } else if (updateGroup) {
      addSystemProgressEntry(child, ChildSystemProgressEntryType.GROUP_MODIFIED);
    }

    childRepository.flush();

    return augmentWithDetails(child);
  }

  private void addSystemProgressEntry(
      Child child, ChildSystemProgressEntryType childSystemProgressEntryType) {
    progressEntryUtil.addSystemProgressEntry(child, childSystemProgressEntryType);
  }
}
