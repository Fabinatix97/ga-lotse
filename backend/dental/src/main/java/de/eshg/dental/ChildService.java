/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.dental.ExaminationService.calculateAgeOfChild;
import static de.eshg.dental.mapper.BooleanWithUnknownMapper.mapToBooleanWithUnknown;
import static de.eshg.dental.util.ChildSystemProgressEntryType.DATA_EXPORTED;
import static de.eshg.dental.util.ChildSystemProgressEntryType.LABELS_MODIFIED;

import com.google.common.collect.Iterables;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.api.commons.SortDirection;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.dental.api.AnnualInstitutionDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildForTransitionDto;
import de.eshg.dental.api.ChildForTransitionSortKey;
import de.eshg.dental.api.ChildNameDto;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.ChildSearchResult;
import de.eshg.dental.api.ChildSortKey;
import de.eshg.dental.api.ChildrenForTransitionSortParameters;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.GroupForTransitionDto;
import de.eshg.dental.api.GroupPromotionDto;
import de.eshg.dental.api.InstitutionForTransitionDto;
import de.eshg.dental.api.SchoolYearTransitionFilterParameters;
import de.eshg.dental.api.SchoolYearTransitionPaginationAndSortParameters;
import de.eshg.dental.api.SchoolYearTransitionSearchParameters;
import de.eshg.dental.api.SchoolYearTransitionSortKey;
import de.eshg.dental.api.SchoolYearTransitionStatusDto;
import de.eshg.dental.api.SyncPersonRequest;
import de.eshg.dental.api.UpdateBulkResponse;
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.api.UpdateFluoridationConsentBulkRequest;
import de.eshg.dental.api.UpdatePersonRequest;
import de.eshg.dental.business.model.BulkUpdateChildrenStatistics;
import de.eshg.dental.business.model.ChildWithPersonAndContactData;
import de.eshg.dental.business.model.ChildWithPersonData;
import de.eshg.dental.business.model.PagedChildren;
import de.eshg.dental.business.model.PagedInstitutionsForTransition;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.config.DentalProperties;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.domain.model.Person;
import de.eshg.dental.domain.model.ProcedureLabel;
import de.eshg.dental.domain.model.ScreeningExaminationResult;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ProcedureLabelRepository;
import de.eshg.dental.importer.ChildColumn;
import de.eshg.dental.importer.ChildImporter;
import de.eshg.dental.importer.ChildRowReader;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.dental.mapper.InstitutionMapper;
import de.eshg.dental.statistic.StatisticsCalculationHelper;
import de.eshg.dental.util.ChildForTransitionPageSpec;
import de.eshg.dental.util.ChildPageSpec;
import de.eshg.dental.util.ChildSystemProgressEntryType;
import de.eshg.dental.util.ExceptionUtil;
import de.eshg.dental.util.GroupNameComparator;
import de.eshg.dental.util.ProgressEntryUtil;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.procedures.ProcedureQuery;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.lib.xlsximport.FeedbackColumnAccessor;
import de.eshg.lib.xlsximport.XlsxImport;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.XlsxUtil;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.text.similarity.FuzzyScore;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ChildService {

  private static final Logger log = LoggerFactory.getLogger(ChildService.class);
  private static final int FUZZY_SEARCH_SCORE_THRESHOLD = 5;
  public static final int DEFAULT_PAGE_SIZE = 25;
  public static final int DEFAULT_PAGE_NUMBER = 0;

  private final Clock clock;
  private final AuditLogger auditLogger;
  private final ChildRepository childRepository;
  private final ContactClient contactClient;
  private final DentalProperties dentalProperties;
  private final PersonClient personClient;
  private final ProgressEntryUtil progressEntryUtil;
  private final ProcedureSearchService<Child> procedureSearchService;
  private final ProcedureQuery procedureQuery;
  private final ProcedureLabelRepository procedureLabelRepository;
  private final Validator validator;

  public ChildService(
      Clock clock,
      AuditLogger auditLogger,
      ChildRepository childRepository,
      ContactClient contactClient,
      DentalProperties dentalProperties,
      PersonClient personClient,
      ProgressEntryUtil progressEntryUtil,
      ProcedureSearchService<Child> procedureSearchService,
      ProcedureQuery procedureQuery,
      ProcedureLabelRepository procedureLabelRepository,
      Validator validator) {
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.childRepository = childRepository;
    this.contactClient = contactClient;
    this.dentalProperties = dentalProperties;
    this.personClient = personClient;
    this.progressEntryUtil = progressEntryUtil;
    this.procedureSearchService = procedureSearchService;
    this.procedureQuery = procedureQuery;
    this.procedureLabelRepository = procedureLabelRepository;
    this.validator = validator;
  }

  Child createChild(CreateChildRequest request, Child existingChild) {
    UUID newChildId =
        Iterables.getOnlyElement(personClient.addChildren(List.of(request), DataOriginDto.MANUAL));
    Child createdChild = createChild(request, newChildId);
    personClient.updateReferencePersons(Map.of(request, createdChild));

    if (existingChild != null) {
      createdChild.setProcedureLabels(new ArrayList<>(existingChild.getProcedureLabels()));
      createdChild.setNote(existingChild.getNote());
    }
    childRepository.save(createdChild);
    return createdChild;
  }

  private Child createChild(CreateChildRequest request, UUID personId) {
    Child createdChild = createChild(personId);
    ChildMapper.mapToChild(request, createdChild);
    return createdChild;
  }

  public Child createChild(UUID personId) {
    Child createdChild = new Child();
    createdChild.setProcedureType(ProcedureType.DENTAL_CHILD);
    createdChild.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    Person person = new Person();
    person.setPersonType(Person.PERSON_TYPE_USED_FOR_CHILDREN);
    person.setCentralFileStateId(personId);
    createdChild.addRelatedPerson(person);
    return createdChild;
  }

  public Map<CreateChildRequest, Child> createChildrenAndUpdateProcedureLabelsAndNote(
      List<CreateChildRequest> requests,
      Map<PersonKeyAttributes, Child> previouslyClosedChildren,
      DataOriginDto dataOrigin) {
    if (requests.isEmpty()) {
      return Map.of();
    }

    List<UUID> childFileStateIds = personClient.addChildren(requests, dataOrigin);

    Map<CreateChildRequest, Child> createdChildren = new LinkedHashMap<>();
    for (int i = 0; i < requests.size(); i++) {
      Child child = createChild(requests.get(i), childFileStateIds.get(i));
      CreateChildRequest request = requests.get(i);
      ChildMapper.mapToChild(request, child);

      if (!previouslyClosedChildren.isEmpty()) {
        PersonKeyAttributes key =
            new PersonKeyAttributes(request.firstName(), request.lastName(), request.dateOfBirth());
        Child closedChild = previouslyClosedChildren.get(key);
        if (closedChild != null) {
          child.setProcedureLabels(new ArrayList<>(closedChild.getProcedureLabels()));
          child.setNote(closedChild.getNote());
        }
      }
      childRepository.save(child);
      createdChildren.put(request, child);
    }
    return createdChildren;
  }

  public void updateReferencePersons(Map<CreateChildRequest, Child> createdChildren) {
    personClient.updateReferencePersons(createdChildren);
  }

  public Child validateNoDuplicateExistsAndClosePreviousChildren(CreateChildRequest request) {
    Year requestedYear = Year.of(request.year());

    Optional<Child> openChild = findOpenChildWithSamePersonKeyAttributes(request);
    openChild.ifPresent(
        existingOpenChild -> {
          if (!existingOpenChild.getYear().isBefore(requestedYear)) {
            throw new BadRequestException(
                "Child already exists in year " + existingOpenChild.getYear());
          }

          log.debug(
              "Auto-closing existing child {} from year {}",
              existingOpenChild.getExternalId(),
              existingOpenChild.getYear());
          Assert.isTrue(
              existingOpenChild.getYear().isBefore(requestedYear),
              () -> "Unexpected year of existing child: %s".formatted(existingOpenChild.getYear()));
          closeChild(existingOpenChild);
        });

    return openChild.orElse(null);
  }

  protected void closeChildAndFlush(Child child) {
    closeChild(child);
    childRepository.flush();
  }

  protected void closeChild(Child child) {
    child.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  protected void reopenChild(Child child) {
    Assert.isTrue(
        child.getProcedureStatus() == ProcedureStatus.CLOSED,
        () -> "%s is not closed".formatted(child));
    child.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  private Optional<Child> findOpenChildWithSamePersonKeyAttributes(CreateChildRequest request) {
    PersonKeyAttributes personKeyAttributes =
        new PersonKeyAttributes(request.firstName(), request.lastName(), request.dateOfBirth());
    Map<PersonKeyAttributes, Child> result =
        findOpenChildrenWithSamePersonKeyAttributes(Set.of(personKeyAttributes));
    return Optional.ofNullable(result.get(personKeyAttributes));
  }

  public Map<PersonKeyAttributes, Child> findOpenChildrenWithSamePersonKeyAttributes(
      Set<PersonKeyAttributes> personKeyAttributes) {
    if (personKeyAttributes.isEmpty()) {
      return Map.of();
    }

    Map<PersonKeyAttributes, List<Child>> results =
        procedureSearchService.searchProceduresByPersons(
            personKeyAttributes,
            Person.PERSON_TYPE_USED_FOR_CHILDREN,
            ProcedureSearchService.isInStatusOpen(),
            Person.class);

    return results.entrySet().stream()
        .filter(entry -> !entry.getValue().isEmpty())
        .collect(
            StreamUtil.toLinkedHashMap(
                Map.Entry::getKey, result -> Iterables.getOnlyElement(result.getValue())));
  }

  public List<Examination> getAllExaminations(
      List<ChildWithPersonAndContactData> childAndAllPreviousChildren) {
    return childAndAllPreviousChildren.stream()
        .map(ChildWithPersonAndContactData::child)
        .map(Child::getExaminations)
        .flatMap(Collection::stream)
        .sorted(Comparator.comparing(Examination::getDateAndTime).reversed())
        .toList();
  }

  public List<FluoridationConsent> getAllFluoridationConsents(
      List<ChildWithPersonAndContactData> childAndAllPreviousChildren) {
    return childAndAllPreviousChildren.stream()
        .map(ChildWithPersonAndContactData::child)
        .map(Child::getFluoridationConsents)
        .flatMap(Collection::stream)
        .sorted(
            Comparator.comparing(FluoridationConsent::getDateOfConsent, Comparator.reverseOrder())
                .thenComparing(FluoridationConsent::getModifiedAt, Comparator.reverseOrder()))
        .toList();
  }

  public List<FluoridationConsent> getRelevantFluoridationConsentsForExamination(
      List<ChildWithPersonAndContactData> childDataList, LocalDate examinationDate) {

    return childDataList.stream()
        .map(ChildWithPersonAndContactData::child)
        .flatMap(child -> child.getFluoridationConsents().stream())
        .filter(consent -> !consent.getDateOfConsent().isAfter(examinationDate))
        .sorted(
            Comparator.comparing(FluoridationConsent::getDateOfConsent, Comparator.reverseOrder())
                .thenComparing(FluoridationConsent::getModifiedAt, Comparator.reverseOrder()))
        .toList();
  }

  public List<AnnualInstitutionDto> getAllInstitutions(
      List<ChildWithPersonAndContactData> childAndAllPreviousChildren) {

    return childAndAllPreviousChildren.stream()
        .map(
            child ->
                new AnnualInstitutionDto(
                    child.child().getExternalId(),
                    InstitutionMapper.mapContactToInstitutionDto(child.contact()),
                    child.child().getYear().getValue(),
                    child.child().getGroupName()))
        .sorted(Comparator.comparingInt(AnnualInstitutionDto::year).reversed())
        .toList();
  }

  List<ChildWithPersonAndContactData> getChildAndAllPreviousChildren(Child child) {
    List<UUID> ids =
        personClient.getPersonFileStateIdsAssociatedWithFileState(
            child.getChildIdFromCentralFile());
    List<Child> childAndAllPreviousChildren =
        childRepository.findByRelatedPersonsCentralFileStateId(ids);

    return augmentWithChildAndContactData(childAndAllPreviousChildren);
  }

  public Child findByExternalIdOrThrow(UUID childId) {
    return childRepository
        .findByExternalId(childId)
        .orElseThrow(ChildService::childNotFoundException);
  }

  public Child findByExternalIdForUpdate(UUID childId) {
    return childRepository
        .findByExternalIdForUpdate(childId)
        .orElseThrow(ChildService::childNotFoundException);
  }

  public ChildWithPersonAndContactData augmentWithPersonAndContactDetails(Child child) {
    GetPersonFileStateResponse person = personClient.fetchPersonData(child);
    ContactDto contact = contactClient.getContact(child.getInstitutionId());

    return new ChildWithPersonAndContactData(child, person, contact);
  }

  private List<ChildWithPersonAndContactData> augmentWithContactDetails(
      List<ChildWithPersonData> children) {
    List<UUID> contactIds =
        children.stream().map(child -> child.child().getInstitutionId()).distinct().toList();
    Map<UUID, ContactDto> augmentedInstitutionData =
        contactClient.getBulkContacts(contactIds, Function.identity());

    return children.stream()
        .map(
            child ->
                new ChildWithPersonAndContactData(
                    child.child(),
                    child.person(),
                    augmentedInstitutionData.get(child.child().getInstitutionId())))
        .toList();
  }

  public PagedChildren getChildren(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters,
      ProcedureSearchParameters searchParameters) {

    boolean hasSearchParameters = ProcedureValidator.hasNonNullValue(searchParameters);
    if (hasSearchParameters) {
      return performSearchWithSearchParameters(searchParameters, paginationAndSortParameters);
    } else {
      return performSearchWithoutSearchParameters(filterParameters, paginationAndSortParameters);
    }
  }

  private PagedChildren performSearchWithSearchParameters(
      ProcedureSearchParameters searchParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters) {
    List<Child> children =
        procedureSearchService.searchProceduresByPerson(
            searchParameters, Person.PERSON_TYPE_USED_FOR_CHILDREN);

    if (containsClosedProcedure(children)) {
      List<ChildWithPersonAndContactData> augmentedChildren =
          getAndAugmentLatestProcedure(children);
      return new PagedChildren(augmentedChildren, augmentedChildren.size());
    } else {
      List<ChildWithPersonAndContactData> augmentedChildren =
          performPartialSearch(paginationAndSortParameters, children);
      return new PagedChildren(augmentedChildren, children.size());
    }
  }

  private PagedChildren performSearchWithoutSearchParameters(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters) {
    ChildSpecification childSpecification =
        new ChildSpecification(filterParameters, paginationAndSortParameters);
    ChildPageSpec pageSpec = ChildSpecification.toPageSpec(paginationAndSortParameters);
    if (pageSpec.sortKey().isPersonAttribute()) {
      return getChildrenWithPersonAttributeSortKey(pageSpec, childSpecification);
    } else {
      Pageable pageable = PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize());
      Page<Child> page = childRepository.findAll(childSpecification, pageable);
      List<ChildWithPersonAndContactData> augmentedChildren =
          augmentWithChildAndContactData(page.getContent());
      return new PagedChildren(augmentedChildren, page.getTotalElements());
    }
  }

  private List<ChildWithPersonAndContactData> getAndAugmentLatestProcedure(List<Child> children) {
    Optional<Child> latest = children.stream().max(Comparator.comparing(Child::getId));
    return latest.map(this::augmentWithPersonAndContactDetails).stream().toList();
  }

  private List<ChildWithPersonAndContactData> performPartialSearch(
      ChildPaginationAndSortParameters paginationAndSortParameters, List<Child> children) {
    ChildPageSpec pageSpec = ChildSpecification.toPageSpec(paginationAndSortParameters);
    ChildSortKey sortKey = pageSpec.sortKey();
    SortDirection sortDirection = pageSpec.direction();
    int pageSize = pageSpec.pageSize();
    int offset = pageSpec.pageNumber() * pageSize;

    if (sortKey.isPersonAttribute()) {
      return augmentWithContactDetails(
          personClient.fetchChildWithPersonDataInBulk(children).stream()
              .sorted(applySortDirection(personAttributeSortComparator(sortKey), sortDirection))
              .skip(offset)
              .limit(pageSize)
              .toList());
    } else {
      return augmentWithContactDetails(
          personClient.fetchChildWithPersonDataInBulk(
              children.stream()
                  .sorted(
                      applySortDirection(
                          nonPersonAttributeSortComparator(sortKey, sortDirection), sortDirection))
                  .skip(offset)
                  .limit(pageSize)
                  .toList()));
    }
  }

  private static boolean containsClosedProcedure(List<Child> children) {
    return children.stream()
        .anyMatch(child -> child.getProcedureStatus() == ProcedureStatus.CLOSED);
  }

  private static Comparator<ChildWithPersonData> personAttributeSortComparator(
      ChildSortKey sortKey) {
    return switch (sortKey) {
      case DATE_OF_BIRTH -> Comparator.comparing(child -> child.person().dateOfBirth());
      case FIRST_NAME -> Comparator.comparing(child -> child.person().firstName());
      case LAST_NAME -> Comparator.comparing(child -> child.person().lastName());
      default ->
          throw new IllegalArgumentException("Invalid sort comparator for sort key" + sortKey);
    };
  }

  private static Comparator<Child> nonPersonAttributeSortComparator(
      ChildSortKey sortKey, SortDirection sortDirection) {
    return switch (sortKey) {
      case ID -> Comparator.comparing(Child::getId);
      case YEAR -> Comparator.comparing(Child::getYear);
      case GROUP_NAME ->
          Comparator.comparing(
              Child::getGroupName,
              sortDirection == SortDirection.ASC
                  ? Comparator.nullsLast(Comparator.naturalOrder())
                  : Comparator.nullsFirst(Comparator.naturalOrder()));
      default ->
          throw new IllegalArgumentException("Invalid sort comparator for sort key" + sortKey);
    };
  }

  private static <T> Comparator<T> applySortDirection(
      Comparator<T> comparator, SortDirection sortDirection) {
    if (SortDirection.DESC.equals(sortDirection)) {
      comparator = comparator.reversed();
    }

    return comparator;
  }

  public List<ChildWithPersonData> augmentWithChildData(List<Child> children) {
    Map<UUID, GetPersonFileStateResponse> persons =
        personClient.fetchPersonDataInBulkToMap(children);

    return children.stream()
        .map(
            child -> {
              UUID centralFileStateId = child.getChildIdFromCentralFile();
              GetPersonFileStateResponse person = persons.get(centralFileStateId);
              Assert.notNull(person, () -> "Failed to resolve child " + centralFileStateId);
              return new ChildWithPersonData(child, person);
            })
        .toList();
  }

  public List<ChildWithPersonAndContactData> augmentWithChildAndContactData(List<Child> children) {
    Map<UUID, GetPersonFileStateResponse> persons =
        personClient.fetchPersonDataInBulkToMap(children);
    Map<UUID, ContactDto> contacts = fetchContactsInBulk(children);

    return children.stream()
        .map(
            child -> {
              GetPersonFileStateResponse person = persons.get(child.getChildIdFromCentralFile());
              Assert.notNull(
                  person, () -> "Failed to resolve child " + child.getChildIdFromCentralFile());
              ContactDto contact = contacts.get(child.getInstitutionId());
              Assert.notNull(
                  contact, () -> "Failed to resolve contact " + child.getInstitutionId());
              return new ChildWithPersonAndContactData(child, person, contact);
            })
        .toList();
  }

  private Map<UUID, ContactDto> fetchContactsInBulk(List<Child> children) {
    List<UUID> institutionIds = children.stream().map(Child::getInstitutionId).distinct().toList();
    return contactClient.getBulkContacts(institutionIds, Function.identity());
  }

  public ImportResult importChildrenFromFile(MultipartFile file, UUID institutionId, Year year)
      throws IOException {
    return XlsxImport.processWorkbook(
        file,
        dentalProperties.getMaxNumberOfImportRows(),
        ChildColumn.values(),
        (sheet, actualColumns) -> {
          ChildImporter importer =
              new ChildImporter(
                  sheet,
                  new ChildRowReader(sheet, clock, actualColumns, isDaycare(institutionId)),
                  new FeedbackColumnAccessor(actualColumns, ChildColumn.CHILD_ID.getHeader()),
                  institutionId,
                  year,
                  this);
          return importer.process();
        });
  }

  private boolean isDaycare(UUID institutionId) {
    ContactDto contact = contactClient.getContact(institutionId);
    return contact instanceof InstitutionContactDto institutionContactDto
        && institutionContactDto.category().equals(InstitutionContactCategoryDto.DAYCARE);
  }

  private PagedChildren getChildrenWithPersonAttributeSortKey(
      ChildPageSpec pageSpec, ChildSpecification childSpecification) {
    List<UUID> allChildIds = findAllChildIds(childSpecification);

    List<UUID> pagedAndSortedFileStateIds =
        personClient
            .fetchPersonDataInBulk(
                allChildIds,
                new GetPersonFileStatesSortParameters(
                    pageSpec.sortKey().asPersonsSortKey(),
                    pageSpec.direction(),
                    pageSpec.pageNumber(),
                    pageSpec.pageSize()))
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

    List<ChildWithPersonAndContactData> augmentedChildren = augmentWithChildAndContactData(result);
    return new PagedChildren(augmentedChildren, allChildIds.size());
  }

  private List<UUID> findAllChildIds(Specification<Child> childSpecification) {
    return procedureQuery.findAllRelatedPersonFileStateIds(
        childSpecification, Child.class, Person.PERSON_TYPE_USED_FOR_CHILDREN);
  }

  public List<String> getInstitutionGroups(UUID institutionId, boolean openGroupsOnly) {
    return childRepository.findDistinctInstitutionGroups(institutionId, openGroupsOnly);
  }

  public List<String> getInstitutionGroups(UUID institutionId, boolean openGroupsOnly, int year) {
    return childRepository.findDistinctInstitutionGroupsByYear(
        institutionId, openGroupsOnly, Year.of(year));
  }

  public void updateChildDataAndFlush(Child child, UpdateChildRequest request) {
    updateChildData(child, request);
    childRepository.flush();
  }

  public void updateChildData(Child child, UpdateChildRequest request) {
    validator.validateInstitutionAndGroupName(request.institutionId(), request.groupName());
    boolean updateGroup = !Objects.equals(request.groupName(), child.getGroupName());
    if (updateGroup) {
      log.debug("Updating group name: '{}' → '{}'", child.getGroupName(), request.groupName());
      if (request.groupName() != null) {
        child.setGroupName(request.groupName().trim());
      } else {
        child.setGroupName(null);
      }
      addSystemProgressEntry(child, ChildSystemProgressEntryType.GROUP_MODIFIED);
    }

    boolean updateInstitution = !Objects.equals(request.institutionId(), child.getInstitutionId());
    if (updateInstitution) {
      log.debug(
          "Updating institution: '{}' → '{}'", child.getInstitutionId(), request.institutionId());
      child.setInstitutionId(request.institutionId());
      addSystemProgressEntry(child, ChildSystemProgressEntryType.INSTITUTION_MODIFIED);
    }

    updateFluoridationConsent(
        child, ChildMapper.mapFluoridationToDomain(request.fluoridationConsent()));

    updateProcedureLabels(child, request.procedureLabels());
  }

  private void updateFluoridationConsent(
      Child child, FluoridationConsent requestedFluoridationConsent) {
    FluoridationConsent persistedFluoridationConsent = child.getLatestFluoridationConsent();
    boolean updateFluoridationConsent =
        requestedFluoridationConsent != null
            && (persistedFluoridationConsent == null
                || !fluoridationConsentsMatch(
                    requestedFluoridationConsent, persistedFluoridationConsent));

    if (updateFluoridationConsent) {
      requestedFluoridationConsent.setModifiedAt(Instant.now(clock));
      child.addFluoridationConsent(requestedFluoridationConsent);
      progressEntryUtil.addSystemProgressEntry(
          child, ChildSystemProgressEntryType.FLUORIDATION_CONSENT_MODIFIED);
    }
  }

  private void updateProcedureLabels(Child child, List<UUID> requestedLabelIds) {
    List<UUID> persistedLabelIds =
        child.getProcedureLabels().stream().map(ProcedureLabel::getExternalId).toList();
    if (!CollectionUtils.isEqualCollection(requestedLabelIds, persistedLabelIds)) {
      List<ProcedureLabel> procedureLabels =
          procedureLabelRepository.findAllByExternalIdInOrderById(requestedLabelIds);
      Validator.validateLabelsExist(
          requestedLabelIds, procedureLabels.stream().map(ProcedureLabel::getExternalId).toList());
      child.setProcedureLabels(procedureLabels);
      progressEntryUtil.addSystemProgressEntry(child, LABELS_MODIFIED);
    }
  }

  private boolean fluoridationConsentsMatch(
      FluoridationConsent fluoridationConsent1, FluoridationConsent fluoridationConsent2) {
    return fluoridationConsent1.getConsented().equals(fluoridationConsent2.getConsented())
        && Objects.equals(fluoridationConsent1.hasAllergy(), fluoridationConsent2.hasAllergy())
        && fluoridationConsent1.getDateOfConsent().equals(fluoridationConsent2.getDateOfConsent());
  }

  protected void updateFluoridationConsentInBulk(UpdateFluoridationConsentBulkRequest request) {
    List<Child> children = childRepository.findByExternalIdsForUpdate(request.childIds()).toList();

    FluoridationConsent fluoridationConsent = new FluoridationConsent();
    fluoridationConsent.setDateOfConsent(request.dateOfConsent());
    fluoridationConsent.setConsented(mapToBooleanWithUnknown(request.consented()));

    for (Child child : children) {
      updateFluoridationConsent(child, fluoridationConsent);
    }
    childRepository.flush();
  }

  private void addSystemProgressEntry(
      Child child, ChildSystemProgressEntryType childSystemProgressEntryType) {
    progressEntryUtil.addSystemProgressEntry(child, childSystemProgressEntryType);
  }

  public List<ChildSearchResult> searchChildren(UUID institutionId, String searchString) {
    List<Child> childrenAtInstitution =
        childRepository.findByInstitutionIdAndProcedureStatusOrderById(
            institutionId, ProcedureStatus.OPEN);

    Map<UUID, Child> childrenByFileStateIds =
        childrenAtInstitution.stream()
            .collect(StreamUtil.toLinkedHashMap(Child::getChildIdFromCentralFile));

    return personClient.fetchPersonDataInBulk(childrenAtInstitution).stream()
        .map(fs -> ChildService.computeFuzzyScore(fs, searchString, childrenByFileStateIds))
        .filter(c -> c.score() > FUZZY_SEARCH_SCORE_THRESHOLD)
        .sorted(
            Comparator.comparing(ChildWithScore::score)
                .reversed()
                .thenComparing(c -> getFullPersonName(c.fileState()))
                .thenComparing(c -> c.child().getId()))
        .map(ChildWithScore::mapToChildSearchResult)
        .toList();
  }

  public UpdateBulkResponse closeChildrenInBulkWithVersionControl(
      Map<UUID, Long> childIdsAndVersion) {
    List<Child> children =
        childRepository
            .findByExternalIdsForUpdate(childIdsAndVersion.keySet().stream().toList())
            .toList();
    BulkUpdateChildrenStatistics stats = new BulkUpdateChildrenStatistics();
    for (Child child : children) {
      try {
        validateSingleChildIsOpenAndOfCurrentYear(child);
        ValidationUtil.validateVersion(childIdsAndVersion.get(child.getExternalId()), child);
      } catch (Exception e) {
        log.info("Error in closing children in bulk: ", e);
        stats.countError();
        continue;
      }
      closeChild(child);
      stats.countUpdated();
    }
    return stats.mapToResponse();
  }

  public void closeChildrenInBulk(List<UUID> childIds, boolean isXlsxImport) {
    List<Child> childrenToClose = childRepository.findByExternalIdsForUpdate(childIds).toList();
    // xlsx-import must be able to close children of all previous years
    if (!isXlsxImport) {
      validateAllChildrenAreOpenAndOfCurrentYear(childrenToClose);
    }
    closeChildren(childrenToClose);
  }

  public void closeGroupsInBulk(UUID institutionId, List<String> groupNames) {
    Year currentSchoolYear = Year.now(clock).minusYears(1);
    List<Child> childrenToClose =
        childRepository.findByInstitutionIdAndGroupNameAndYearForUpdate(
            institutionId, groupNames, currentSchoolYear);
    closeChildren(childrenToClose);
  }

  private void closeChildren(List<Child> childrenToClose) {
    log.info(
        "Closing {} {}",
        childrenToClose.size(),
        childrenToClose.size() == 1 ? "child" : "children");
    for (Child child : childrenToClose) {
      closeChild(child);
    }
  }

  private void validateAllChildrenAreOpenAndOfCurrentYear(List<Child> childrenToClose) {
    Validator.validateAllChildrenAreOpenAndOfYear(childrenToClose, Year.now(clock).minusYears(1));
  }

  private void validateSingleChildIsOpenAndOfCurrentYear(Child child) {
    if (!child.getYear().equals(Year.now(clock).minusYears(1))
        || !child.getProcedureStatus().equals(ProcedureStatus.OPEN)) {
      throw new BadRequestException("Child is not from current year or an open procedure");
    }
  }

  public UpdateBulkResponse promoteChildrenInBulk(Map<UUID, Long> childIdsAndVersion) {
    List<Child> children =
        childRepository
            .findByExternalIdsForUpdate(childIdsAndVersion.keySet().stream().toList())
            .toList();
    BulkUpdateChildrenStatistics stats = new BulkUpdateChildrenStatistics();
    List<Child> childrenToPromote = new ArrayList<>();
    for (Child child : children) {
      try {
        validateSingleChildIsOpenAndOfCurrentYear(child);
        ValidationUtil.validateVersion(childIdsAndVersion.get(child.getExternalId()), child);
      } catch (Exception e) {
        log.info("Error in bulk children promotion: ", e);
        stats.countError();
        continue;
      }
      childrenToPromote.add(child);
    }
    return promoteChildren(childrenToPromote, Function.identity(), stats);
  }

  private UpdateBulkResponse promoteChildren(
      List<Child> childrenToPromote,
      Function<String, String> groupNameTransitions,
      BulkUpdateChildrenStatistics stats) {
    logPromotedChildren(childrenToPromote);

    if (childrenToPromote.isEmpty()) {
      return stats.mapToResponse();
    }

    Year newSchoolYear = Year.now(clock);
    List<UUID> newFileStateIds =
        personClient.duplicatePersonFileStates(childrenToPromote).personFileStateIds();

    for (int i = 0; i < childrenToPromote.size(); i++) {
      promoteChild(
          childrenToPromote.get(i), groupNameTransitions, newFileStateIds.get(i), newSchoolYear);
      stats.countUpdated();
    }

    closeChildrenInBulk(childrenToPromote.stream().map(Child::getExternalId).toList(), false);

    return stats.mapToResponse();
  }

  public List<UUID> promoteGroupsInBulk(
      UUID institutionId, List<GroupPromotionDto> groupTransitions) {
    Year currentSchoolYear = Year.now(clock).minusYears(1);
    Validator.validateUniquenessOfOriginGroupNames(groupTransitions);

    Map<String, String> groupTransitionsMap =
        groupTransitions.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    GroupPromotionDto::originGroupName, GroupPromotionDto::targetGroupName));

    List<Child> childrenToPromote =
        childRepository.findByInstitutionIdAndGroupNameAndYearForUpdate(
            institutionId, groupTransitionsMap.keySet().stream().toList(), currentSchoolYear);

    return promoteSchoolChildren(childrenToPromote, groupTransitionsMap::get);
  }

  private List<UUID> promoteSchoolChildren(
      List<Child> childrenToPromote, Function<String, String> groupNameTransitions) {
    logPromotedChildren(childrenToPromote);

    if (childrenToPromote.isEmpty()) {
      return List.of();
    }

    Year newSchoolYear = Year.now(clock);
    List<UUID> newFileStateIds =
        personClient.duplicatePersonFileStates(childrenToPromote).personFileStateIds();

    List<UUID> promotedChildren = new ArrayList<>();
    for (int i = 0; i < childrenToPromote.size(); i++) {
      Child promotedChild =
          promoteChild(
              childrenToPromote.get(i),
              groupNameTransitions,
              newFileStateIds.get(i),
              newSchoolYear);
      promotedChildren.add(promotedChild.getExternalId());
    }

    closeChildrenInBulk(childrenToPromote.stream().map(Child::getExternalId).toList(), false);

    return promotedChildren;
  }

  private Child promoteChild(
      Child childToPromote,
      Function<String, String> groupNameTransitions,
      UUID fileStateId,
      Year newSchoolYear) {
    String newGroupName = groupNameTransitions.apply(childToPromote.getGroupName());

    Child promotedChild = createChild(fileStateId);
    promotedChild.setYear(newSchoolYear);
    promotedChild.setGroupName(newGroupName);
    promotedChild.setInstitutionId(childToPromote.getInstitutionId());
    promotedChild.setProcedureLabels(new ArrayList<>(childToPromote.getProcedureLabels()));
    promotedChild.setNote(childToPromote.getNote());
    childRepository.save(promotedChild);
    return promotedChild;
  }

  private static void logPromotedChildren(List<Child> childrenToPromote) {
    log.info(
        "Promoting {} {}",
        childrenToPromote.size(),
        childrenToPromote.size() == 1 ? "child" : "children");
  }

  void updateChildPersonAndFlush(Child child, UpdatePersonRequest request) {
    updateChildPerson(child, ChildMapper.mapToPersonDetailsDto(request));
    childRepository.flush();
  }

  void updateChildPerson(Child child, PersonDetailsDto dto) {
    UUID currentFileStateId = child.getChildIdFromCentralFile();
    UUID updatedFileStateId = personClient.updateChildInCentralFile(currentFileStateId, dto);

    if (!currentFileStateId.equals(updatedFileStateId)) {
      child.getChild().setCentralFileStateId(updatedFileStateId);
      progressEntryUtil.addProgressEntryWithPreviousPersonFileStateId(child, currentFileStateId);
    }
  }

  public Child syncPersonData(UUID childId, SyncPersonRequest request) {
    Person person = findPersonForUpdate(childId, request.fileStateId(), request.personVersion());
    Child child = person.getProcedure();
    UUID updatedFileStateId =
        personClient.syncPerson(person.getCentralFileStateId(), request.referenceVersion());
    person.setCentralFileStateId(updatedFileStateId);

    addSyncSystemProgressEntry(child);
    childRepository.flush();
    return child;
  }

  private Person findPersonForUpdate(UUID childId, UUID centralFileStateId, long version) {
    Person person =
        childRepository.findByProcedureExternalIdAndFileStateIdForUpdate(
            childId, centralFileStateId);
    if (person == null) {
      throw new NotFoundException("Person with given fileStateId for given child not found");
    }
    ValidationUtil.validateVersion(version, person);
    return person;
  }

  private void addSyncSystemProgressEntry(Child child) {
    boolean hasBeenClosed = child.getProcedureStatus() == ProcedureStatus.CLOSED;
    if (hasBeenClosed) {
      reopenChild(child);
    }

    progressEntryUtil.addSystemProgressEntry(
        child, ChildSystemProgressEntryType.CHILD_SYNCED_WITH_CENTRAL_FILE);

    if (hasBeenClosed) {
      closeChild(child);
    }
  }

  void updateAgeAndDecayRisk(LocalDate dateOfBirth, List<Examination> examinations) {
    for (Examination examination : examinations) {
      if (examination.getResult()
          instanceof ScreeningExaminationResult screeningExaminationResult) {
        screeningExaminationResult.setDecayRisk(
            calculateDecayRisk(dateOfBirth, screeningExaminationResult));
        screeningExaminationResult.setChildAge(calculateAgeOfChild(examination, dateOfBirth));
      }
    }
  }

  private static Boolean calculateDecayRisk(
      LocalDate dateOfBirth, ScreeningExaminationResult screeningExamination) {
    return StatisticsCalculationHelper.calculateDecayRisk(
            screeningExamination.getToothDiagnoses(),
            calculateAgeOfChild(screeningExamination.getExamination(), dateOfBirth))
        .orElse(null);
  }

  public List<GroupForTransitionDto> getGroupsForSchoolYearTransition(UUID institutionId) {
    List<Child> openChildren =
        childRepository.findByInstitutionIdAndYearAndProcedureStatus(
            institutionId, Year.now(clock).minusYears(1), ProcedureStatus.OPEN);

    List<ChildWithPersonData> augmentedChildren = augmentWithChildData(openChildren);

    return augmentedChildren.stream()
        .collect(
            Collectors.groupingBy(
                childData -> childData.child().getGroupName(),
                Collectors.mapping(
                    childData ->
                        new ChildNameDto(
                            childData.person().firstName(), childData.person().lastName()),
                    Collectors.toList())))
        .entrySet()
        .stream()
        .map(entry -> new GroupForTransitionDto(entry.getKey(), entry.getValue()))
        .sorted((a, b) -> GroupNameComparator.compareGroupNames(a.groupName(), b.groupName()))
        .toList();
  }

  public List<ChildForTransitionDto> getChildrenForSchoolYearTransition(
      UUID institutionId, ChildrenForTransitionSortParameters sortParameters) {
    Year currentSchoolYear = Year.now(clock).minusYears(1);

    ChildForTransitionSpecification childSpecification =
        new ChildForTransitionSpecification(sortParameters, currentSchoolYear, institutionId);
    ChildForTransitionPageSpec pageSpec =
        ChildForTransitionSpecification.toPageSpec(sortParameters);
    boolean sortKeyIsPersonAttribute =
        Optional.ofNullable(sortParameters.sortKey())
            .map(ChildForTransitionSortKey::isPersonAttribute)
            .orElse(false);
    if (sortKeyIsPersonAttribute) {
      return getChildrenForTransitionWithPersonAttributeSortKey(pageSpec, childSpecification);
    }

    List<Child> openChildren = childRepository.findAll(childSpecification);
    List<ChildWithPersonData> augmentedChildren = augmentWithChildData(openChildren);
    return augmentedChildren.stream().map(this::mapToChildForTransitionDto).toList();
  }

  private ChildForTransitionDto mapToChildForTransitionDto(ChildWithPersonData augmentedData) {
    Child childData = augmentedData.child();
    GetPersonFileStateResponse personData = augmentedData.person();
    return new ChildForTransitionDto(
        childData.getExternalId(),
        personData.firstName(),
        personData.lastName(),
        personData.gender(),
        childData.getGroupName(),
        personData.dateOfBirth(),
        childData.getVersion());
  }

  private List<ChildForTransitionDto> getChildrenForTransitionWithPersonAttributeSortKey(
      ChildForTransitionPageSpec pageSpec, ChildForTransitionSpecification childSpecification) {
    List<UUID> childIds = findAllChildIds(childSpecification);

    List<UUID> pagedAndSortedFileStateIds =
        personClient
            .fetchPersonDataInBulk(
                childIds,
                new GetPersonFileStatesSortParameters(
                    pageSpec.sortKey().asPersonsSortKey(), pageSpec.direction(), null, null))
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

    List<ChildWithPersonData> augmentedChildren = augmentWithChildData(result);
    return augmentedChildren.stream().map(this::mapToChildForTransitionDto).toList();
  }

  record ChildWithScore(GetPersonFileStateResponse fileState, Child child, int score) {

    private ChildSearchResult mapToChildSearchResult() {
      return new ChildSearchResult(
          child().getExternalId(),
          fileState().firstName(),
          fileState().lastName(),
          fileState().dateOfBirth(),
          child().getGroupName(),
          fileState().gender());
    }
  }

  private static ChildWithScore computeFuzzyScore(
      GetPersonFileStateResponse fs, String searchString, Map<UUID, Child> childrenByFileStateIds) {
    String personName = getFullPersonName(fs);
    int fuzzyScore = computeFuzzyScore(searchString, personName);
    return new ChildWithScore(fs, childrenByFileStateIds.get(fs.id()), fuzzyScore);
  }

  private static String getFullPersonName(GetPersonFileStateResponse fs) {
    return String.join(" ", fs.firstName(), fs.lastName());
  }

  static int computeFuzzyScore(String searchString, String personName) {
    return new FuzzyScore(Locale.GERMAN).fuzzyScore(personName, searchString);
  }

  public List<UUID> collectExistingChildIds(List<UUID> childIds) {
    if (childIds.isEmpty()) {
      return List.of();
    }
    return childRepository.collectExistingProceduresByExternalIds(childIds);
  }

  public Stream<ChildWithPersonAndContactData> findByPersonId(UUID personId) {
    List<UUID> personFileStateIds =
        personClient.getPersonFileStateIdsAssociatedWithReferencePerson(personId);

    return childRepository
        .findByRelatedPersonsCentralFileStateIds(
            personFileStateIds, Person.PERSON_TYPE_USED_FOR_CHILDREN)
        .stream()
        .filter(child -> child.getChild().getProcedure().getProcedureStatus().isOpen())
        .map(this::augmentWithPersonAndContactDetails);
  }

  static NotFoundException childNotFoundException() {
    return ExceptionUtil.notFoundException(Child.class);
  }

  PagedInstitutionsForTransition searchSchoolsForSchoolYearTransition(
      SchoolYearTransitionPaginationAndSortParameters paginationAndSortParameters,
      SchoolYearTransitionFilterParameters filterParameters,
      SchoolYearTransitionSearchParameters searchParameters) {
    return searchInstitutionsForSchoolYearTransition(
        InstitutionContactCategoryDto.SCHOOL,
        paginationAndSortParameters,
        filterParameters,
        searchParameters);
  }

  PagedInstitutionsForTransition searchDaycaresForSchoolYearTransition(
      SchoolYearTransitionPaginationAndSortParameters paginationAndSortParameters,
      SchoolYearTransitionFilterParameters filterParameters,
      SchoolYearTransitionSearchParameters searchParameters) {
    return searchInstitutionsForSchoolYearTransition(
        InstitutionContactCategoryDto.DAYCARE,
        paginationAndSortParameters,
        filterParameters,
        searchParameters);
  }

  private PagedInstitutionsForTransition searchInstitutionsForSchoolYearTransition(
      InstitutionContactCategoryDto contactCategory,
      SchoolYearTransitionPaginationAndSortParameters paginationAndSortParameters,
      SchoolYearTransitionFilterParameters filterParameters,
      SchoolYearTransitionSearchParameters searchParameters) {
    Year currentSchoolYear = Year.now(clock).minusYears(1);
    List<ChildRepository.InstitutionCounts> institutionCounts = new ArrayList<>();
    if (contactCategory == InstitutionContactCategoryDto.SCHOOL) {
      institutionCounts.addAll(
          childRepository.getInstitutionsAndCompletedGroups(currentSchoolYear));
    } else if (contactCategory == InstitutionContactCategoryDto.DAYCARE) {
      institutionCounts.addAll(
          childRepository.getInstitutionsAndCompletedChildren(currentSchoolYear));
    }

    Map<UUID, ChildRepository.InstitutionCounts> institutionCountByInstitution =
        institutionCounts.stream()
            .collect(
                StreamUtil.toLinkedHashMap(ChildRepository.InstitutionCounts::getInstitutionId));

    List<UUID> institutionIds = institutionCountByInstitution.keySet().stream().toList();
    Map<UUID, InstitutionContactDto> augmentedInstitutions =
        contactClient
            .getBulkContacts(institutionIds)
            .map(InstitutionContactDto.class::cast)
            .filter(contact -> contact.category().equals(contactCategory))
            .collect(StreamUtil.toLinkedHashMap(InstitutionContactDto::id));

    Stream<InstitutionContactDto> institutionContacts = augmentedInstitutions.values().stream();
    institutionContacts = searchInstitutions(searchParameters, institutionContacts);

    Stream<InstitutionForTransitionDto> institutionsForTransition =
        institutionContacts.map(
            institution -> {
              ChildRepository.InstitutionCounts searchResult =
                  institutionCountByInstitution.get(institution.id());
              int completedCount = searchResult.getCompletedCount();
              int totalCount = searchResult.getTotalCount();

              return new InstitutionForTransitionDto(
                  InstitutionMapper.mapToInstitutionWithAddressDto(institution),
                  completedCount,
                  totalCount,
                  calculateSchoolYearTransitionStatus(completedCount, totalCount));
            });
    institutionsForTransition = filterInstitutions(filterParameters, institutionsForTransition);

    List<InstitutionForTransitionDto> institutionsResult = institutionsForTransition.toList();
    return new PagedInstitutionsForTransition(
        sortAndPaginate(institutionsResult, paginationAndSortParameters),
        institutionsResult.size());
  }

  private static List<InstitutionForTransitionDto> sortAndPaginate(
      List<InstitutionForTransitionDto> institutions,
      SchoolYearTransitionPaginationAndSortParameters parameters) {
    SortDirection sortDirection = parameters.sortDirectionOrFallback(SortDirection.ASC);
    SchoolYearTransitionSortKey schoolYearTransitionSortKey =
        parameters.sortKeyOrFallback(SchoolYearTransitionSortKey.NAME);

    int pageNumber = parameters.pageNumberOrFallback(DEFAULT_PAGE_NUMBER);
    int pageSize = parameters.pageSizeOrFallback(DEFAULT_PAGE_SIZE);
    int offset = pageNumber * pageSize;

    return institutions.stream()
        .sorted(sortComparator(schoolYearTransitionSortKey, sortDirection))
        .skip(offset)
        .limit(pageSize)
        .toList();
  }

  private static Comparator<InstitutionForTransitionDto> sortComparator(
      SchoolYearTransitionSortKey schoolYearTransitionSortKey, SortDirection sortDirection) {

    Comparator<InstitutionForTransitionDto> comparator =
        switch (schoolYearTransitionSortKey) {
          case ID ->
              Comparator.comparing(
                  institutionForTransition -> institutionForTransition.institution().id());
          case COMPLETED_COUNT -> Comparator.comparing(InstitutionForTransitionDto::completedCount);
          case STATUS -> Comparator.comparing(InstitutionForTransitionDto::status);
          case NAME ->
              Comparator.comparing(
                  (InstitutionForTransitionDto institutionForTransition) ->
                      institutionForTransition.institution().name());
        };

    if (SortDirection.DESC.equals(sortDirection)) {
      comparator = comparator.reversed();
    }

    comparator =
        comparator
            .thenComparing(
                institutionForTransition -> institutionForTransition.institution().name())
            .thenComparing(
                institutionForTransitionDto -> institutionForTransitionDto.institution().city())
            .thenComparing(institutionForTransition -> institutionForTransition.institution().id());

    return comparator;
  }

  private static Stream<InstitutionContactDto> searchInstitutions(
      SchoolYearTransitionSearchParameters searchParameters,
      Stream<InstitutionContactDto> institutions) {
    if (searchParameters.institutionName() != null) {
      return institutions.filter(
          institutionForTransition ->
              computeFuzzyScore(searchParameters.institutionName(), institutionForTransition.name())
                  > FUZZY_SEARCH_SCORE_THRESHOLD);
    }
    return institutions;
  }

  private static Stream<InstitutionForTransitionDto> filterInstitutions(
      SchoolYearTransitionFilterParameters filterParameters,
      Stream<InstitutionForTransitionDto> institutions) {
    if (filterParameters.statusFilter() != null) {
      return institutions.filter(
          institutionForTransition ->
              institutionForTransition.status().equals(filterParameters.statusFilter()));
    }
    return institutions;
  }

  private SchoolYearTransitionStatusDto calculateSchoolYearTransitionStatus(
      int completedGroups, int allGroups) {
    return completedGroups == allGroups
        ? SchoolYearTransitionStatusDto.COMPLETE
        : SchoolYearTransitionStatusDto.INCOMPLETE;
  }

  protected Resource createChildDataForExport(
      UUID institutionId, String groupName, int schoolYear) {
    List<Child> children =
        childRepository.findByInstitutionIdAndGroupNameAndProcedureStatusAndYearOrderById(
            institutionId, groupName, ProcedureStatus.OPEN, Year.of(schoolYear));
    List<ChildWithPersonData> augmentedChildren =
        augmentWithChildData(children).stream()
            .sorted(
                Comparator.comparing(
                        (ChildWithPersonData childData) -> childData.person().lastName())
                    .thenComparing(childData -> childData.person().firstName()))
            .toList();

    try (XSSFWorkbook workbook = new XSSFWorkbook();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

      XSSFSheet sheet = workbook.createSheet();
      createHeader(sheet);

      XSSFCellStyle cellStyle = XlsxUtil.createDefaultCellStyle(sheet);
      cellStyle.setQuotePrefixed(true);

      for (int i = 0; i < augmentedChildren.size(); i++) {
        ChildWithPersonData child = augmentedChildren.get(i);
        Row row = sheet.createRow(i + 1);

        Cell cell0 = row.createCell(0);
        XlsxUtil.writeValue(cell0, child.person().firstName(), cellStyle);
        Cell cell1 = row.createCell(1);
        XlsxUtil.writeValue(cell1, child.person().lastName(), cellStyle);

        progressEntryUtil.addSystemProgressEntry(child.child(), DATA_EXPORTED);
      }
      sheet.autoSizeColumn(0);
      sheet.autoSizeColumn(1);

      workbook.write(outputStream);
      return new ByteArrayResource(outputStream.toByteArray());
    } catch (IOException exception) {
      throw new UncheckedIOException("Unable to create export", exception);
    }
  }

  private static void createHeader(XSSFSheet sheet) {
    XSSFCellStyle headerCellStyle = XlsxUtil.createHeaderCellStyle(sheet);

    Row headerRow = sheet.createRow(0);

    Cell headerCellFirstName = headerRow.createCell(0);
    XlsxUtil.writeValue(headerCellFirstName, "Vorname", headerCellStyle);

    Cell headerCellLastName = headerRow.createCell(1);
    XlsxUtil.writeValue(headerCellLastName, "Nachname", headerCellStyle);
  }
}
