/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.dental.util.ChildSystemProgressEntryType.LABELS_MODIFIED;

import com.google.common.collect.Iterables;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.PersonKeyAttributes;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
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
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.api.UpdatePersonRequest;
import de.eshg.dental.business.model.ChildWithAugmentedData;
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
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.io.IOException;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  private final PersonApi personApi;
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
      PersonApi personApi,
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
    this.personApi = personApi;
    this.contactClient = contactClient;
    this.dentalProperties = dentalProperties;
    this.personClient = personClient;
    this.progressEntryUtil = progressEntryUtil;
    this.procedureSearchService = procedureSearchService;
    this.procedureQuery = procedureQuery;
    this.procedureLabelRepository = procedureLabelRepository;
    this.validator = validator;
  }

  Child createChild(CreateChildRequest request) {
    AddPersonFileStateRequest addPersonRequest =
        mapToAddPersonFileStateRequest(DataOriginDto.MANUAL, request);
    AddPersonFileStateResponse response = personApi.addPersonFileState(addPersonRequest);

    Child createdChild = createChild(request, response.id());
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

  public Map<CreateChildRequest, Child> createChildrenAndUpdateProcedureLabels(
      List<CreateChildRequest> requests,
      Map<PersonKeyAttributes, Child> previouslyClosedChildren,
      DataOriginDto dataOrigin) {
    if (requests.isEmpty()) {
      return Map.of();
    }

    List<UUID> childFileStateIds = addChildren(requests, dataOrigin);

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
        }
      }
      childRepository.save(child);
      createdChildren.put(request, child);
    }
    return createdChildren;
  }

  public void updateReferencePersons(Map<CreateChildRequest, Child> createdChildren) {
    for (Map.Entry<CreateChildRequest, Child> entry : createdChildren.entrySet()) {
      CreateChildRequest request = entry.getKey();
      Child child = entry.getValue();

      GetReferencePersonResponse referencePerson =
          personApi.getReferencePerson(child.getChildIdFromCentralFile());
      AddPersonFileStateResponse addPersonFileStateResponse =
          personApi.updateReferencePerson(
              referencePerson.id(),
              new UpdateReferencePersonRequest(
                  new de.eshg.base.centralfile.api.person.UpdatePersonRequest(
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
                  referencePerson.version()));
      child.getChild().setCentralFileStateId(addPersonFileStateResponse.id());
    }
  }

  public void validateNoDuplicateExistsAndClosePreviousChildren(CreateChildRequest request) {
    Year requestedYear = Year.of(request.year());

    findOpenChildWithSamePersonKeyAttributes(request)
        .ifPresent(
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
                  () ->
                      "Unexpected year of existing child: %s"
                          .formatted(existingOpenChild.getYear()));
              closeChild(existingOpenChild);
            });
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

  private Optional<ChildWithAugmentedData> findLatestChildWithSearchParameters(
      ProcedureSearchParameters searchParameters) {

    List<Child> children =
        procedureSearchService.searchProceduresByPerson(
            searchParameters, Person.PERSON_TYPE_USED_FOR_CHILDREN);

    Optional<Child> latestChild = children.stream().max(Comparator.comparing(Child::getId));
    return latestChild.map(this::augmentWithDetails);
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
      List<ChildWithAugmentedData> childAndAllPreviousChildren) {
    return childAndAllPreviousChildren.stream()
        .map(ChildWithAugmentedData::child)
        .map(Child::getExaminations)
        .flatMap(Collection::stream)
        .sorted(Comparator.comparing(Examination::getDateAndTime).reversed())
        .toList();
  }

  public List<FluoridationConsent> getAllFluoridationConsents(
      List<ChildWithAugmentedData> childAndAllPreviousChildren) {
    return childAndAllPreviousChildren.stream()
        .map(ChildWithAugmentedData::child)
        .map(Child::getFluoridationConsents)
        .flatMap(Collection::stream)
        .sorted(
            Comparator.comparing(FluoridationConsent::getDateOfConsent, Comparator.reverseOrder())
                .thenComparing(FluoridationConsent::getModifiedAt, Comparator.reverseOrder()))
        .toList();
  }

  public List<AnnualInstitutionDto> getAllInstitutions(
      List<ChildWithAugmentedData> childAndAllPreviousChildren) {

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

  List<ChildWithAugmentedData> getChildAndAllPreviousChildren(Child child) {
    UUID childIdFromCentralFile = child.getChildIdFromCentralFile();
    GetFileStateIdsResponse response =
        personApi.getPersonFileStateIdsAssociatedWithFileState(childIdFromCentralFile);

    List<Child> childAndAllPreviousChildren =
        childRepository.findByRelatedPersonsCentralFileStateId(response.fileStateIds());

    return augmentWithChildAndContactData(childAndAllPreviousChildren);
  }

  private List<UUID> addChildren(
      Collection<CreateChildRequest> requests, DataOriginDto dataOrigin) {
    List<AddPersonFileStateRequest> personsToAdd =
        requests.stream()
            .map(request -> mapToAddPersonFileStateRequest(dataOrigin, request))
            .toList();

    AddPersonFileStatesResponse response =
        personApi.addPersonFileStates(new AddPersonFileStatesRequest(personsToAdd));

    return response.personFileStateIds();
  }

  private static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      DataOriginDto dataOrigin, CreateChildRequest request) {
    return new AddPersonFileStateRequest(
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
        dataOrigin);
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

  public ChildWithAugmentedData augmentWithDetails(Child child) {
    GetPersonFileStateResponse person =
        personApi.getPersonFileState(child.getChildIdFromCentralFile());
    ContactDto contact = contactClient.getContact(child.getInstitutionId());

    return new ChildWithAugmentedData(child, person, contact);
  }

  public PagedChildren getChildren(
      ChildFilterParameters filterParameters,
      ChildPaginationAndSortParameters paginationAndSortParameters,
      ProcedureSearchParameters searchParameters) {

    if (ProcedureValidator.hasNonNullValue(searchParameters)) {
      List<ChildWithAugmentedData> child =
          findLatestChildWithSearchParameters(searchParameters).stream().toList();
      return new PagedChildren(child, child.size());
    }

    ChildSpecification childSpecification =
        new ChildSpecification(filterParameters, paginationAndSortParameters);
    ChildPageSpec pageSpec = ChildSpecification.toPageSpec(paginationAndSortParameters);
    boolean sortKeyIsPersonAttribute =
        Optional.ofNullable(paginationAndSortParameters.sortKey())
            .map(ChildSortKey::isPersonAttribute)
            .orElse(false);
    if (sortKeyIsPersonAttribute) {
      return getChildrenWithPersonAttributeSortKey(pageSpec, childSpecification);
    } else {
      Pageable pageable = PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize());
      Page<Child> page = childRepository.findAll(childSpecification, pageable);
      List<ChildWithAugmentedData> augmentedChildren =
          augmentWithChildAndContactData(page.getContent());
      return new PagedChildren(augmentedChildren, page.getTotalElements());
    }
  }

  private List<ChildWithAugmentedData> augmentWithChildData(List<Child> children) {
    Map<UUID, GetPersonFileStateResponse> persons =
        personClient.fetchPersonDataInBulk(children).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    return children.stream()
        .map(
            child -> {
              UUID centralFileStateId = child.getChildIdFromCentralFile();
              GetPersonFileStateResponse person = persons.get(centralFileStateId);
              Assert.notNull(person, () -> "Failed to resolve child " + centralFileStateId);
              return new ChildWithAugmentedData(child, person, null);
            })
        .toList();
  }

  public List<ChildWithAugmentedData> augmentWithChildAndContactData(List<Child> children) {
    Map<UUID, GetPersonFileStateResponse> persons =
        personClient.fetchPersonDataInBulk(children).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
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
              return new ChildWithAugmentedData(child, person, contact);
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

    List<ChildWithAugmentedData> augmentedChildren = augmentWithChildAndContactData(result);
    return new PagedChildren(augmentedChildren, allChildIds.size());
  }

  private List<UUID> findAllChildIds(Specification<Child> childSpecification) {
    return procedureQuery.findAllRelatedPersonFileStateIds(
        childSpecification, Child.class, Person.PERSON_TYPE_USED_FOR_CHILDREN);
  }

  public List<String> getInstitutionGroups(UUID institutionId) {
    return childRepository.findDistinctInstitutionGroups(institutionId);
  }

  public void updateChildData(Child child, UpdateChildRequest request) {
    ValidationUtil.validateVersion(request.version(), child);
    validator.validateInstitutionAndGroupName(request.institutionId(), request.groupName());
    boolean updateGroup = !Objects.equals(request.groupName(), child.getGroupName());
    if (updateGroup) {
      log.debug("Updating group name: '{}' → '{}'", child.getGroupName(), request.groupName());
      if (request.groupName() != null) {
        child.setGroupName(request.groupName().trim());
      } else {
        child.setGroupName(null);
      }
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

    FluoridationConsent requestedFluoridationConsent =
        ChildMapper.mapFluoridationToDomain(request.fluoridationConsent());
    FluoridationConsent persistedFluoridationConsent = child.getCurrentFluoridationConsent();
    boolean updateFluoridationConsent =
        requestedFluoridationConsent != null
            && (persistedFluoridationConsent == null
                || !fluoridationConsentsMatch(
                    requestedFluoridationConsent, persistedFluoridationConsent));

    if (updateFluoridationConsent) {
      requestedFluoridationConsent.setModifiedAt(Instant.now(clock));
      child.addFluoridationConsent(requestedFluoridationConsent);
    }

    updateProcedureLabels(child, request.procedureLabels());

    if (updateGroup) {
      log.debug("Updating group name: '{}' → '{}'", child.getGroupName(), request.groupName());
      child.setGroupName(request.groupName());
    }

    childRepository.flush();
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
    return fluoridationConsent1.isConsented() == fluoridationConsent2.isConsented()
        && Objects.equals(fluoridationConsent1.hasAllergy(), fluoridationConsent2.hasAllergy())
        && fluoridationConsent1.getDateOfConsent().equals(fluoridationConsent2.getDateOfConsent());
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

  public List<UUID> promoteChildrenInBulk(List<UUID> childIds) {
    List<Child> childrenToPromote = childRepository.findByExternalIdsForUpdate(childIds).toList();
    validateAllChildrenAreOpenAndOfCurrentYear(childrenToPromote);
    return promoteChildren(childrenToPromote, Function.identity());
  }

  public List<UUID> promoteGroupsInBulk(
      UUID institutionId, List<GroupPromotionDto> groupTransitions) {
    Year currentSchoolYear = Year.now(clock).minusYears(1);
    Validator.validateUniquenessOfOriginGroupNames(groupTransitions);

    Map<String, String> groupTransitionsMap =
        groupTransitions.stream()
            .collect(
                Collectors.toMap(
                    GroupPromotionDto::originGroupName, GroupPromotionDto::targetGroupName));

    List<Child> childrenToPromote =
        childRepository.findByInstitutionIdAndGroupNameAndYearForUpdate(
            institutionId, groupTransitionsMap.keySet().stream().toList(), currentSchoolYear);

    return promoteChildren(childrenToPromote, groupTransitionsMap::get);
  }

  private List<UUID> promoteChildren(
      List<Child> childrenToPromote, Function<String, String> groupNameTransitions) {
    log.info(
        "Promoting {} {}",
        childrenToPromote.size(),
        childrenToPromote.size() == 1 ? "child" : "children");

    if (childrenToPromote.isEmpty()) {
      return List.of();
    }

    Year newSchoolYear = Year.now(clock);
    List<UUID> newFileStateIds = duplicatePersonFileStates(childrenToPromote).personFileStateIds();

    List<UUID> promotedChildren = new ArrayList<>();
    for (int i = 0; i < childrenToPromote.size(); i++) {
      Child childToPromote = childrenToPromote.get(i);
      UUID fileStateId = newFileStateIds.get(i);
      String newGroupName = groupNameTransitions.apply(childToPromote.getGroupName());

      Child promotedChild = createChild(fileStateId);
      promotedChild.setYear(newSchoolYear);
      promotedChild.setGroupName(newGroupName);
      promotedChild.setInstitutionId(childToPromote.getInstitutionId());
      promotedChild.setProcedureLabels(new ArrayList<>(childToPromote.getProcedureLabels()));
      childRepository.save(promotedChild);

      promotedChildren.add(promotedChild.getExternalId());
    }

    closeChildrenInBulk(childrenToPromote.stream().map(Child::getExternalId).toList(), false);

    return promotedChildren;
  }

  private AddPersonFileStatesResponse duplicatePersonFileStates(List<Child> children) {
    List<GetPersonFileStateResponse> personFileStates =
        personClient.fetchPersonDataInBulk(children);
    List<AddPersonFileStateRequest> fileStateAddRequests =
        personFileStates.stream().map(ChildService::buildFileStateAddRequest).toList();
    return personApi.addPersonFileStates(new AddPersonFileStatesRequest(fileStateAddRequests));
  }

  private static AddPersonFileStateRequest buildFileStateAddRequest(
      GetPersonFileStateResponse personFileState) {
    return new AddPersonFileStateRequest(
        new PersonDetailsDto(
            personFileState.title(),
            personFileState.salutation(),
            personFileState.gender(),
            personFileState.firstName(),
            personFileState.lastName(),
            personFileState.dateOfBirth(),
            personFileState.nameAtBirth(),
            personFileState.placeOfBirth(),
            personFileState.countryOfBirth(),
            personFileState.emailAddresses(),
            personFileState.phoneNumbers(),
            personFileState.contactAddress(),
            personFileState.differentBillingAddress()),
        personFileState.dataOrigin());
  }

  void updateChildPerson(Child child, UpdatePersonRequest request) {
    ValidationUtil.validateVersion(request.version(), child);

    UUID currentFileStateId = child.getChildIdFromCentralFile();
    UUID updatedFileStateId =
        personClient.updateChildInCentralFile(
            currentFileStateId, ChildMapper.mapToPersonDetailsDto(request));

    if (!currentFileStateId.equals(updatedFileStateId)) {
      child.getChild().setCentralFileStateId(updatedFileStateId);
      progressEntryUtil.addProgressEntryWithPreviousPersonFileStateId(child, currentFileStateId);
      childRepository.flush();
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

  void updateDecayRisk(LocalDate dateOfBirth, List<Examination> examinations) {
    for (Examination examination : examinations) {
      if (examination.getResult()
          instanceof ScreeningExaminationResult screeningExaminationResult) {
        screeningExaminationResult.setDecayRisk(
            calculateDecayRisk(dateOfBirth, screeningExaminationResult));
      }
    }
  }

  private static Boolean calculateDecayRisk(
      LocalDate dateOfBirth, ScreeningExaminationResult screeningExamination) {
    return StatisticsCalculationHelper.calculateDecayRisk(
            screeningExamination.getToothDiagnoses(),
            ExaminationService.calculateAgeOfChild(
                screeningExamination.getExamination(), dateOfBirth))
        .orElse(null);
  }

  public List<GroupForTransitionDto> getGroupsForSchoolYearTransition(UUID institutionId) {
    List<Child> openChildren =
        childRepository.findByInstitutionIdAndYearAndProcedureStatus(
            institutionId, Year.now(clock).minusYears(1), ProcedureStatus.OPEN);

    List<ChildWithAugmentedData> augmentedChildren = augmentWithChildData(openChildren);

    return augmentedChildren.stream()
        .collect(
            Collectors.groupingBy(
                childData -> childData.child().getGroupName(),
                Collectors.mapping(
                    childData ->
                        new ChildNameDto(
                            childData.personData().firstName(), childData.personData().lastName()),
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
    List<ChildWithAugmentedData> augmentedChildren = augmentWithChildData(openChildren);
    return augmentedChildren.stream().map(this::mapToChildForTransitionDto).toList();
  }

  private ChildForTransitionDto mapToChildForTransitionDto(ChildWithAugmentedData augmentedData) {
    GetPersonFileStateResponse personData = augmentedData.personData();
    return new ChildForTransitionDto(
        augmentedData.child().getExternalId(),
        personData.firstName(),
        personData.lastName(),
        personData.gender(),
        augmentedData.child().getGroupName(),
        personData.dateOfBirth());
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

    List<ChildWithAugmentedData> augmentedChildren = augmentWithChildData(result);
    return augmentedChildren.stream().map(this::mapToChildForTransitionDto).toList();
  }

  record ChildWithScore(GetPersonFileStateResponse fileState, Child child, int score) {

    private ChildSearchResult mapToChildSearchResult() {
      return new ChildSearchResult(
          child().getExternalId(),
          fileState().firstName(),
          fileState().lastName(),
          fileState().dateOfBirth(),
          child().getGroupName().trim(),
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

  public Stream<ChildWithAugmentedData> findByPersonId(UUID personId) {
    List<UUID> personFileStateIds =
        personApi.getPersonFileStateIdsAssociatedWithReferencePerson(personId).fileStateIds();

    return childRepository
        .findByRelatedPersonsCentralFileStateIds(
            personFileStateIds, Person.PERSON_TYPE_USED_FOR_CHILDREN)
        .stream()
        .filter(child -> child.getChild().getProcedure().getProcedureStatus().isOpen())
        .map(this::augmentWithDetails);
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
                Collectors.toMap(
                    ChildRepository.InstitutionCounts::getInstitutionId, Function.identity()));

    List<UUID> institutionIds = institutionCountByInstitution.keySet().stream().toList();
    Map<UUID, InstitutionContactDto> augmentedInstitutions =
        contactClient
            .getBulkContacts(institutionIds)
            .map(InstitutionContactDto.class::cast)
            .filter(contact -> contact.category().equals(contactCategory))
            .collect(Collectors.toMap(InstitutionContactDto::id, Function.identity()));

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
}
