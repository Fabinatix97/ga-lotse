/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.ExceptionUtil.*;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.CreateProcedureLabelRequest;
import de.eshg.schoolentry.api.GetProcedureLabelsResponse;
import de.eshg.schoolentry.api.ProcedureLabelDto;
import de.eshg.schoolentry.api.ProcedureLabelPaginationParameters;
import de.eshg.schoolentry.api.UpdateProcedureLabelRequest;
import de.eshg.schoolentry.domain.model.ProcedureLabel;
import de.eshg.schoolentry.domain.repository.ProcedureLabelRepository;
import de.eshg.schoolentry.mapper.ProcedureLabelMapper;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.awt.Color;
import java.security.SecureRandom;
import java.util.*;
import org.jetbrains.annotations.VisibleForTesting;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(BaseUrls.SchoolEntry.PROCEDURE_LABEL_CONTROLLER)
@Tag(name = "ProcedureLabel")
public class ProcedureLabelController {

  private static final Random random = new SecureRandom();

  private final ProcedureLabelRepository procedureLabelRepository;

  public ProcedureLabelController(ProcedureLabelRepository procedureLabelRepository) {
    this.procedureLabelRepository = procedureLabelRepository;
  }

  @PostMapping
  @Transactional
  public ProcedureLabelDto createLabel(@Valid @RequestBody CreateProcedureLabelRequest request) {
    validateName(request.name());

    ProcedureLabel label = buildProcedureLabel(request);
    ProcedureLabel persistedLabel = procedureLabelRepository.save(label);

    return ProcedureLabelMapper.toDto(persistedLabel);
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetProcedureLabelsResponse getLabels(
      @InlineParameterObject @ParameterObject @Valid
          ProcedureLabelPaginationParameters procedureLabelPaginationParameters) {
    List<ProcedureLabel> labels;
    long totalNumberOfElements;
    if (procedureLabelPaginationParameters == null) {
      labels = procedureLabelRepository.findAllByOrderById();
      totalNumberOfElements = labels.size();
    } else {
      Pageable pageable =
          PageRequest.of(
              procedureLabelPaginationParameters.pageNumberOrFallback(0),
              procedureLabelPaginationParameters.pageSizeOrFallback(25),
              Sort.by(Sort.Order.by(BaseEntity_.ID)));
      Page<ProcedureLabel> page = procedureLabelRepository.findAll(pageable);
      labels = page.getContent();
      totalNumberOfElements = page.getTotalElements();
    }
    return new GetProcedureLabelsResponse(
        ProcedureLabelMapper.toDto(labels), totalNumberOfElements);
  }

  @GetMapping("/{id}")
  @Transactional(readOnly = true)
  public ProcedureLabelDto getLabel(@PathVariable("id") UUID id) {
    return ProcedureLabelMapper.toDto(
        procedureLabelRepository
            .findByExternalId(id)
            .orElseThrow(ProcedureLabelController::labelNotFoundException));
  }

  @PutMapping("/{id}")
  @Transactional
  public ProcedureLabelDto updateLabel(
      @PathVariable("id") UUID id, @Valid @RequestBody UpdateProcedureLabelRequest request) {
    ProcedureLabel label =
        procedureLabelRepository
            .findByExternalIdForUpdate(id)
            .orElseThrow(ProcedureLabelController::labelNotFoundException);

    if (label.isReadonly()) {
      throw new BadRequestException("Label %s is readonly and cannot be updated.".formatted(id));
    }
    ValidationUtil.validateVersion(request.version(), label);
    if (!Objects.equals(label.getName(), request.name())) {
      validateName(request.name());
    }

    label.setName(request.name());
    label.setDescription(request.description());

    return ProcedureLabelMapper.toDto(label);
  }

  private void validateName(String name) {
    if (procedureLabelRepository.existsByName(name)) {
      throw new BadRequestException(ErrorCode.ALREADY_EXISTS, "Label already exists");
    }
  }

  private ProcedureLabel buildProcedureLabel(CreateProcedureLabelRequest request) {
    ProcedureLabel label = new ProcedureLabel();
    label.setName(request.name());
    label.setDescription(request.description());
    label.setHexColor(generateRandomColor());
    label.setReadonly(false);

    return label;
  }

  private static String generateRandomColor() {
    return generateRandomColor(random);
  }

  @VisibleForTesting
  static String generateRandomColor(Random random) {
    float randomHue = random.nextFloat();
    Color randomColor = Color.getHSBColor(randomHue, 0.9f, 0.7f);
    return String.format(
        "#%02X%02X%02X", randomColor.getRed(), randomColor.getGreen(), randomColor.getBlue());
  }

  private static NotFoundException labelNotFoundException() {
    return notFoundException(ProcedureLabel.class);
  }
}
