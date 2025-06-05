/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.lib.xlsximport.util.FileResponseUtil.filename;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.dental.api.AnnualInstitutionDto;
import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.ChildDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildForTransitionDto;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.ChildrenForTransitionSortParameters;
import de.eshg.dental.api.CloseChildRequest;
import de.eshg.dental.api.CloseChildrenBulkRequest;
import de.eshg.dental.api.CloseGroupsBulkRequest;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.CreateChildResponse;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.GetChildrenForSchoolYearTransitionResponse;
import de.eshg.dental.api.GetChildrenResponse;
import de.eshg.dental.api.GetChildrenWithDetailsResponse;
import de.eshg.dental.api.GetGroupsForSchoolYearTransitionResponse;
import de.eshg.dental.api.GetInstitutionGroupsResponse;
import de.eshg.dental.api.GetSchoolYearTransitionResponse;
import de.eshg.dental.api.GroupForTransitionDto;
import de.eshg.dental.api.PromoteBulkResponse;
import de.eshg.dental.api.PromoteChildrenBulkRequest;
import de.eshg.dental.api.PromoteGroupsBulkRequest;
import de.eshg.dental.api.SchoolYearTransitionFilterParameters;
import de.eshg.dental.api.SchoolYearTransitionPaginationAndSortParameters;
import de.eshg.dental.api.SchoolYearTransitionSearchParameters;
import de.eshg.dental.api.SearchChildrenResponse;
import de.eshg.dental.api.SyncPersonRequest;
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.api.UpdateFluoridationConsentBulkRequest;
import de.eshg.dental.api.UpdatePersonRequest;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.business.model.PagedChildren;
import de.eshg.dental.business.model.PagedInstitutionsForTransition;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.dental.mapper.ExaminationMapper;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.util.ProcedureValidator;
import de.eshg.lib.xlsximport.TransactionalWithTimeoutForFileImports;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.io.IOException;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(ChildController.BASE_URL)
@Tag(name = "Child")
public class ChildController {

  public static final String BASE_URL = BaseUrls.Dental.CHILD_CONTROLLER;

  private final ChildService childService;
  private final ExaminationService examinationService;
  private final Clock clock;
  private final Validator validator;
  private final Resource childListTemplate;

  public ChildController(
      ChildService childService,
      ExaminationService examinationService,
      Clock clock,
      Validator validator,
      @Value("classpath:templates/import/ChildListTemplate.xlsx") Resource childListTemplate) {
    this.childService = childService;
    this.examinationService = examinationService;
    this.clock = clock;
    this.validator = validator;
    this.childListTemplate = childListTemplate;
  }

  @PostMapping
  @Transactional
  @Operation(summary = "Creates a procedure for a child")
  public CreateChildResponse createChild(@Valid @RequestBody CreateChildRequest request) {
    validator.validateInstitutionAndGroupName(request.institutionId(), request.groupName());

    childService.validateNoDuplicateExistsAndClosePreviousChildren(request);
    Child child = childService.createChild(request);

    return new CreateChildResponse(child.getExternalId());
  }

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(summary = "Returns a list of all dental procedures including child data")
  public GetChildrenResponse getChildren(
      @InlineParameterObject @ParameterObject @Valid ChildFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ChildPaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid ProcedureSearchParameters searchParameters) {
    Validator.validateOnlyOneOfSearchAndFilterParametersAreSet(filterParameters, searchParameters);
    ProcedureValidator.validatePartialSearchParameters(searchParameters);

    PagedChildren pagedChildren =
        childService.getChildren(filterParameters, paginationAndSortParameters, searchParameters);
    return new GetChildrenResponse(
        pagedChildren.stream().map(ChildMapper::mapChildToDto).toList(),
        pagedChildren.totalNumberOfChildren());
  }

  @GetMapping("/by-person-id")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns a list of children including personal data from the central file")
  public GetChildrenWithDetailsResponse getChildrenByPerson(
      @RequestParam(name = "personId") UUID personId) {
    List<ChildDto> children =
        childService.findByPersonId(personId).map(ChildMapper::mapChildToDto).toList();
    return new GetChildrenWithDetailsResponse(children);
  }

  @GetMapping("/{childId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns child details and dental procedures of child identified by UUID")
  public ChildDetailsDto getChild(@PathVariable("childId") UUID childId) {
    Child child = childService.findByExternalIdOrThrow(childId);
    return getChildDetails(child);
  }

  @PutMapping("/{childId}/person")
  @Transactional
  @Operation(summary = "Updates the child's personal data")
  public ChildDetailsDto updateChildPerson(
      @PathVariable("childId") UUID childId, @Valid @RequestBody UpdatePersonRequest request) {
    Child child = childService.findByExternalIdForUpdate(childId);
    ChildDetailsDto childDetails = getChildDetails(child);
    ProcedureValidator.validateProcedureStatusNotClosed(child);
    ValidationUtil.validateVersion(request.version(), child);
    childService.updateChildPersonAndFlush(child, request);
    if (!childDetails.dateOfBirth().equals(request.dateOfBirth())) {
      childService.updateDecayRisk(request.dateOfBirth(), child.getExaminations());
    }
    return getChildDetails(child);
  }

  @PutMapping("/{childId}/sync-person")
  @Transactional
  @Operation(summary = "Synchronizes personal data of a specific child")
  public ChildDetailsDto syncPersonData(
      @PathVariable("childId") UUID childId, @Valid @RequestBody SyncPersonRequest request) {
    Child updatedChild = childService.syncPersonData(childId, request);

    ChildDetailsDto childDetails = getChildDetails(updatedChild);
    childService.updateDecayRisk(childDetails.dateOfBirth(), updatedChild.getExaminations());

    return childDetails;
  }

  @PutMapping("/{childId}")
  @Transactional
  @Operation(summary = "Updates the child related data")
  public ChildDetailsDto updateChild(
      @PathVariable("childId") UUID childId, @Valid @RequestBody UpdateChildRequest request) {
    Child child = childService.findByExternalIdForUpdate(childId);

    ProcedureValidator.validateProcedureStatusNotClosed(child);
    validator.validateInstitutionAndGroupName(request.institutionId(), request.groupName());
    validator.validateFluoridationConsent(request.fluoridationConsent());
    ValidationUtil.validateVersion(request.version(), child);
    childService.updateChildDataAndFlush(child, request);
    return getChildDetails(child);
  }

  @PutMapping("/fluoridation-consent-bulk")
  @Transactional
  @Operation(summary = "Updates fluoridation consent in bulk")
  public void updateFluoridationConsentInBulk(
      @Valid @RequestBody UpdateFluoridationConsentBulkRequest request) {
    childService.updateFluoridationConsentInBulk(request);
  }

  @PutMapping("/{childId}/close")
  @Transactional
  @Operation(summary = "Closes the child")
  public ChildDetailsDto closeChild(
      @PathVariable("childId") UUID childId, @Valid @RequestBody CloseChildRequest request) {
    Child child = childService.findByExternalIdForUpdate(childId);
    ValidationUtil.validateVersion(request.version(), child);
    childService.closeChildAndFlush(child);
    return getChildDetails(child);
  }

  private ChildDetailsDto getChildDetails(Child child) {
    List<ChildWithAugmentedData> childAndAllPreviousChildren =
        childService.getChildAndAllPreviousChildren(child);

    List<Examination> examinations = childService.getAllExaminations(childAndAllPreviousChildren);
    List<FluoridationConsent> fluoridationConsents =
        childService.getAllFluoridationConsents(childAndAllPreviousChildren);

    List<AnnualInstitutionDto> institutions =
        childService.getAllInstitutions(childAndAllPreviousChildren);

    ChildWithAugmentedData augmentedChildData = childService.augmentWithDetails(child);

    return ChildMapper.mapToChildDetailsDto(
        augmentedChildData, examinations, fluoridationConsents, institutions);
  }

  @GetMapping("/examination/{examinationId}")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns an examination based on its identifier")
  public ExaminationDto getExamination(@PathVariable("examinationId") UUID examinationId) {
    Examination examination = examinationService.findExamination(examinationId);
    return ExaminationMapper.mapToDto(examination);
  }

  @PutMapping("/examination/{examinationId}")
  @Transactional
  @Operation(summary = "Updates an examination")
  public ExaminationDto updateExamination(
      @PathVariable("examinationId") UUID examinationId,
      @Valid @RequestBody UpdateExaminationRequest request) {
    Examination examination = examinationService.findExaminationForUpdate(examinationId);
    examinationService.updateExaminationAndFlush(examination, request);
    return ExaminationMapper.mapToDto(examination);
  }

  @ApiResponse(
      responseCode = "200",
      content = @Content(mediaType = MediaType.ALL_VALUE, schema = @Schema(type = "object")))
  @PostMapping(path = "/import/{institutionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @TransactionalWithTimeoutForFileImports
  @Operation(summary = "Upload an XLSX file to create multiple children.")
  public ResponseEntity<MultiValueMap<String, Object>> importXlsx(
      @PathVariable("institutionId") UUID institutionId,
      @RequestParam(value = "schoolYear") @Min(1900) int schoolYear,
      @RequestPart("file") MultipartFile file)
      throws IOException {
    validator.validateSchoolYear(schoolYear);
    validator.validateInstitution(institutionId);
    ImportResult result =
        childService.importChildrenFromFile(file, institutionId, Year.of(schoolYear));

    return FileResponseUtil.mapImportResultToMultipartResponse(result, filename(clock));
  }

  @GetMapping(
      path = "/import/templates/child-list",
      produces = CustomMediaTypes.APPLICATION_XLSX_VALUE)
  @Operation(summary = "Get the XLSX child list template.")
  public ResponseEntity<Resource> getChildListTemplate() {
    return FileResponseUtil.getFileResponseEntity(childListTemplate);
  }

  @GetMapping("/institutions/{institutionId}/groups")
  @Transactional(readOnly = true)
  @Operation(summary = "Returns all created groups of an institution")
  public GetInstitutionGroupsResponse getInstitutionGroups(
      @PathVariable("institutionId") UUID institutionId,
      @RequestParam("openGroupsOnly") boolean openGroupsOnly) {
    return new GetInstitutionGroupsResponse(
        childService.getInstitutionGroups(institutionId, openGroupsOnly));
  }

  @GetMapping("/institutions/{institutionId}/children")
  @Transactional(readOnly = true)
  @Operation(summary = "Searches and returns children associated with the given institution")
  public SearchChildrenResponse searchChildren(
      @PathVariable("institutionId") UUID institutionId,
      @RequestParam(name = "searchString") @NotBlank String searchString) {

    validator.validateInstitution(institutionId);
    return new SearchChildrenResponse(childService.searchChildren(institutionId, searchString));
  }

  @PostMapping("/school-year-transition/close-groups")
  @Transactional
  public void closeGroupsInBulk(@Valid @RequestBody CloseGroupsBulkRequest request) {
    childService.closeGroupsInBulk(request.institutionId(), request.groupNames());
  }

  @PostMapping("/school-year-transition/close-children")
  @Transactional
  public void closeChildrenInBulk(@Valid @RequestBody CloseChildrenBulkRequest request) {
    childService.closeChildrenInBulk(request.childIds(), false);
  }

  @PostMapping("/school-year-transition/promote-groups")
  @Transactional
  public PromoteBulkResponse promoteGroupsInBulk(
      @Valid @RequestBody PromoteGroupsBulkRequest request) {
    List<UUID> childIds =
        childService.promoteGroupsInBulk(request.institutionId(), request.groupPromotions());
    return new PromoteBulkResponse(childIds);
  }

  @PostMapping("/school-year-transition/promote-children")
  @Transactional
  public PromoteBulkResponse promoteChildrenInBulk(
      @Valid @RequestBody PromoteChildrenBulkRequest request) {
    List<UUID> childIds = childService.promoteChildrenInBulk(request.childIds());
    return new PromoteBulkResponse(childIds);
  }

  @GetMapping("/schools-for-transition")
  @Transactional(readOnly = true)
  public GetSchoolYearTransitionResponse getSchoolsForSchoolYearTransition(
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionPaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionSearchParameters searchParameters) {
    PagedInstitutionsForTransition pagedInstitutions =
        childService.searchSchoolsForSchoolYearTransition(
            paginationAndSortParameters, filterParameters, searchParameters);
    return new GetSchoolYearTransitionResponse(
        pagedInstitutions.institutions(), pagedInstitutions.totalNumberOfInstitutions());
  }

  @GetMapping("/daycares-for-transition")
  @Transactional(readOnly = true)
  public GetSchoolYearTransitionResponse getDaycaresForSchoolYearTransition(
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionPaginationAndSortParameters paginationAndSortParameters,
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          SchoolYearTransitionSearchParameters searchParameters) {
    PagedInstitutionsForTransition pagedInstitutions =
        childService.searchDaycaresForSchoolYearTransition(
            paginationAndSortParameters, filterParameters, searchParameters);
    return new GetSchoolYearTransitionResponse(
        pagedInstitutions.institutions(), pagedInstitutions.totalNumberOfInstitutions());
  }

  @GetMapping("/groups-for-transition/{institutionId}")
  @Transactional(readOnly = true)
  public GetGroupsForSchoolYearTransitionResponse getGroupsForSchoolYearTransition(
      @PathVariable("institutionId") UUID institutionId) {
    List<GroupForTransitionDto> groups =
        childService.getGroupsForSchoolYearTransition(institutionId);
    return new GetGroupsForSchoolYearTransitionResponse(groups);
  }

  @GetMapping("/children-for-transition/{institutionId}")
  @Transactional(readOnly = true)
  public GetChildrenForSchoolYearTransitionResponse getChildrenForSchoolYearTransition(
      @PathVariable("institutionId") UUID institutionId,
      @InlineParameterObject @ParameterObject @Valid
          ChildrenForTransitionSortParameters sortParameters) {
    List<ChildForTransitionDto> children =
        childService.getChildrenForSchoolYearTransition(institutionId, sortParameters);
    return new GetChildrenForSchoolYearTransitionResponse(children);
  }

  @GetMapping("/export/{institutionId}")
  @Transactional
  @IntentionalWritingTransaction(reason = "Progress entry creation")
  @Operation(summary = "Exports child data")
  public ResponseEntity<Resource> exportChildData(
      @PathVariable("institutionId") UUID institutionId,
      @RequestParam(value = "groupName", required = false) String groupName,
      @RequestParam(value = "schoolYear") int schoolYear) {
    InstitutionContactDto institution =
        validator.validateInstitutionAndGroupName(institutionId, groupName);
    Resource resource = childService.createChildDataForExport(institutionId, groupName, schoolYear);
    String filename = createFileName(institution, groupName);
    return FileResponseUtil.getFileResponseEntity(resource, filename);
  }

  private String createFileName(InstitutionContactDto institution, String groupName) {
    LocalDate currentDate = LocalDate.now(clock);
    String formattedDate = currentDate.format(DateTimeFormatter.ISO_LOCAL_DATE);

    return switch (institution.category()) {
      case DAYCARE -> {
        String daycareName = institution.name().replace(" ", "-");
        yield groupName == null
            ? "%s_%s".formatted(formattedDate, daycareName)
            : "%s_%s_%s".formatted(formattedDate, daycareName, groupName);
      }
      case SCHOOL -> "%s_Klasse_%s".formatted(formattedDate, groupName);
      default ->
          throw new IllegalStateException("Unexpected contact category: " + institution.category());
    };
  }
}
