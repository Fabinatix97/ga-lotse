/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import static de.eshg.dental.util.ExceptionUtil.*;

import com.google.common.annotations.VisibleForTesting;
import de.eshg.dental.api.CreateProcedureLabelRequest;
import de.eshg.dental.api.GetProcedureLabelsResponse;
import de.eshg.dental.api.ProcedureLabelDto;
import de.eshg.dental.api.UpdateProcedureLabelRequest;
import de.eshg.dental.domain.model.ProcedureLabel;
import de.eshg.dental.domain.repository.ProcedureLabelRepository;
import de.eshg.dental.mapper.ProcedureLabelMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.validation.ValidationUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.awt.Color;
import java.security.SecureRandom;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(BaseUrls.Dental.PROCEDURE_LABEL_CONTROLLER)
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

    ProcedureLabel procedureLabel = buildProcedureLabel(request);
    ProcedureLabel persistedProcedureLabel = procedureLabelRepository.save(procedureLabel);

    return ProcedureLabelMapper.toDto(persistedProcedureLabel);
  }

  @GetMapping
  @Transactional(readOnly = true)
  public GetProcedureLabelsResponse getLabels() {
    List<ProcedureLabel> procedureLabels = procedureLabelRepository.findAllByOrderById();

    return new GetProcedureLabelsResponse(ProcedureLabelMapper.toDto(procedureLabels));
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
    ProcedureLabel procedureLabel =
        procedureLabelRepository
            .findByExternalIdForUpdate(id)
            .orElseThrow(ProcedureLabelController::labelNotFoundException);

    ValidationUtil.validateVersion(request.version(), procedureLabel);
    if (!Objects.equals(procedureLabel.getName(), request.name())) {
      validateName(request.name());
    }

    procedureLabel.setName(request.name());
    procedureLabel.setDescription(request.description());

    return ProcedureLabelMapper.toDto(procedureLabel);
  }

  private void validateName(String name) {
    if (procedureLabelRepository.existsByName(name)) {
      throw new BadRequestException(ErrorCode.ALREADY_EXISTS, "Label already exists");
    }
  }

  private ProcedureLabel buildProcedureLabel(CreateProcedureLabelRequest request) {
    ProcedureLabel procedureLabel = new ProcedureLabel();
    procedureLabel.setName(request.name());
    procedureLabel.setDescription(request.description());
    procedureLabel.setHexColor(generateRandomColor());

    return procedureLabel;
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
