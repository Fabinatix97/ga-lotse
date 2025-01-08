/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.lib.xlsximport.util.FileResponseUtil.filename;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.ChildFilterParameters;
import de.eshg.dental.api.ChildPaginationAndSortParameters;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.CreateChildResponse;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.api.GetChildrenResponse;
import de.eshg.dental.api.GetChildrenWithDetailsResponse;
import de.eshg.dental.api.GetInstitutionGroupsResponse;
import de.eshg.dental.api.SearchChildrenResponse;
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.business.model.ChildWithAugmentedData;
import de.eshg.dental.business.model.PagedChildren;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.mapper.ChildMapper;
import de.eshg.dental.mapper.ExaminationMapper;
import de.eshg.lib.xlsximport.TransactionalWithTimeoutForFileImports;
import de.eshg.lib.xlsximport.model.ImportResult;
import de.eshg.lib.xlsximport.util.FileResponseUtil;
import de.eshg.rest.service.security.config.BaseUrls;
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
import java.time.Year;
import java.util.List;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
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

  public ChildController(
      ChildService childService,
      ExaminationService examinationService,
      Clock clock,
      Validator validator) {
    this.childService = childService;
    this.examinationService = examinationService;
    this.clock = clock;
    this.validator = validator;
  }

  @PostMapping
  @Transactional
  public CreateChildResponse createChild(@Valid @RequestBody CreateChildRequest request) {
    validator.validateInstitution(request.institutionId());

    childService.validateNoDuplicateExistsAndClosePreviousChildren(request);
    Child child = childService.createChild(request);

    return new CreateChildResponse(child.getExternalId());
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetChildrenResponse getChildren(
      @InlineParameterObject @ParameterObject @Valid ChildFilterParameters filterParameters,
      @InlineParameterObject @ParameterObject @Valid
          ChildPaginationAndSortParameters paginationAndSortParameters) {
    PagedChildren pagedChildren =
        childService.getChildren(filterParameters, paginationAndSortParameters);
    return new GetChildrenResponse(
        pagedChildren.stream().map(ChildMapper::mapChildToDto).toList(),
        pagedChildren.totalNumberOfChildren());
  }

  @GetMapping("/by-person-id")
  @Transactional(readOnly = true)
  public GetChildrenWithDetailsResponse getChildrenByPerson(
      @RequestParam(name = "personId") UUID personId) {
    List<ChildDetailsDto> children =
        childService
            .findByPersonId(personId)
            .map(child -> ChildMapper.mapToChildDetailsDto(child, null))
            .toList();
    return new GetChildrenWithDetailsResponse(children);
  }

  @GetMapping("/{childId}")
  @Transactional(readOnly = true)
  public ChildDetailsDto getChild(@PathVariable("childId") UUID childId) {
    ChildWithAugmentedData augmentedChildData = childService.findAndAugmentByExternalId(childId);
    return getChildDetails(augmentedChildData);
  }

  @PutMapping("/{childId}")
  @Transactional
  public ChildDetailsDto updateChild(
      @PathVariable("childId") UUID childId, @Valid @RequestBody UpdateChildRequest request) {
    validator.validateInstitution(request.institutionId());
    ChildWithAugmentedData augmentedChildData = childService.update(childId, request);
    return getChildDetails(augmentedChildData);
  }

  private ChildDetailsDto getChildDetails(ChildWithAugmentedData augmentedChildData) {
    List<Examination> examinations = childService.getAllExaminations(augmentedChildData.child());
    return ChildMapper.mapToChildDetailsDto(augmentedChildData, examinations);
  }

  @GetMapping("/examination/{examinationId}")
  @Transactional(readOnly = true)
  public ExaminationDto getExamination(@PathVariable("examinationId") UUID examinationId) {
    Examination examination = examinationService.findExamination(examinationId);
    return ExaminationMapper.mapToDto(examination);
  }

  @PutMapping("/examination/{examinationId}")
  @Transactional
  public ExaminationDto updateExamination(
      @PathVariable("examinationId") UUID examinationId,
      @Valid @RequestBody UpdateExaminationRequest request) {
    Examination examination = examinationService.findExaminationForUpdate(examinationId);
    examinationService.updateExamination(examination, request);
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

  @GetMapping("/institutions/{institutionId}/groups")
  @Transactional(readOnly = true)
  public GetInstitutionGroupsResponse getInstitutionGroups(
      @PathVariable("institutionId") UUID institutionId) {
    return new GetInstitutionGroupsResponse(childService.getInstitutionGroups(institutionId));
  }

  @GetMapping("/institutions/{institutionId}/children")
  @Transactional(readOnly = true)
  public SearchChildrenResponse searchChildren(
      @PathVariable("institutionId") UUID institutionId,
      @RequestParam(name = "searchString") @NotBlank String searchString) {

    validator.validateInstitution(institutionId);
    return new SearchChildrenResponse(childService.searchChildren(institutionId, searchString));
  }

  @PostMapping("/school-year")
  @Transactional
  public void closeSchoolYear() {
    childService.closeSchoolYear();
  }
}
