/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.ExceptionUtil.*;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.CreateLabelRequest;
import de.eshg.schoolentry.api.GetLabelsResponse;
import de.eshg.schoolentry.api.LabelDto;
import de.eshg.schoolentry.api.UpdateLabelRequest;
import de.eshg.schoolentry.domain.model.Label;
import de.eshg.schoolentry.domain.repository.LabelRepository;
import de.eshg.schoolentry.mapper.LabelMapper;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.awt.Color;
import java.security.SecureRandom;
import java.util.*;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(BaseUrls.SchoolEntry.LABEL_CONTROLLER)
@Tag(name = "Label")
public class LabelController {

  private static final Random random = new SecureRandom();

  private final LabelRepository labelRepository;

  public LabelController(LabelRepository labelRepository) {
    this.labelRepository = labelRepository;
  }

  @PostMapping
  @Transactional
  public LabelDto createLabel(@Valid @RequestBody CreateLabelRequest request) {
    validateName(request.name());

    Label label = buildLabel(request);
    Label persistedLabel = labelRepository.save(label);

    return LabelMapper.toDto(persistedLabel);
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetLabelsResponse getLabels() {
    List<Label> labels = labelRepository.findAllByOrderById();

    return new GetLabelsResponse(LabelMapper.toDto(labels));
  }

  @GetMapping("/{id}")
  @Transactional(readOnly = true)
  public LabelDto getLabel(@PathVariable("id") UUID id) {
    return LabelMapper.toDto(
        labelRepository.findByExternalId(id).orElseThrow(LabelController::labelNotFoundException));
  }

  @PutMapping("/{id}")
  @Transactional
  public LabelDto updateLabel(
      @PathVariable("id") UUID id, @Valid @RequestBody UpdateLabelRequest request) {
    Label label =
        labelRepository
            .findByExternalIdForUpdate(id)
            .orElseThrow(LabelController::labelNotFoundException);

    if (label.isReadonly()) {
      throw new BadRequestException("Label %s is readonly and cannot be updated.".formatted(id));
    }
    ValidationUtil.validateVersion(request.version(), label);
    if (!Objects.equals(label.getName(), request.name())) {
      validateName(request.name());
    }

    label.setName(request.name());
    label.setDescription(request.description());

    return LabelMapper.toDto(label);
  }

  private void validateName(String name) {
    if (labelRepository.existsByName(name)) {
      throw new BadRequestException(ErrorCode.ALREADY_EXISTS, "Label already exists");
    }
  }

  private Label buildLabel(CreateLabelRequest request) {
    Label label = new Label();
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
    return notFoundException(Label.class);
  }
}
