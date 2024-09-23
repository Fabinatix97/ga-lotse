/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.textblock;

import static de.eshg.base.util.PaginationUtil.getPageable;
import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.base.SortDirection;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.editor.TextBlockService;
import de.eshg.lib.editor.api.model.GetTextBlocksResponse;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockFilterParameters;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import de.eshg.lib.editor.api.model.TextBlockSortKey;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeature;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.textblock.persistence.TextBlockRepository;
import de.eshg.travelmedicine.textblock.persistence.entity.TextBlock;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.EscapeCharacter;
import org.springframework.stereotype.Service;

@Service
public class TextBlockServiceImpl implements TextBlockService {

  private final TextBlockRepository textBlockRepository;
  private final TravelMedicineFeatureToggle featureToggle;

  private static final EscapeCharacter ESCAPING = EscapeCharacter.DEFAULT;

  public TextBlockServiceImpl(
      TextBlockRepository textBlockRepository, TravelMedicineFeatureToggle featureToggle) {
    this.textBlockRepository = textBlockRepository;
    this.featureToggle = featureToggle;
  }

  private TextBlock loadTextBlockEntity(UUID textBlockId) {
    return textBlockRepository
        .findById(textBlockId)
        .orElseThrow(() -> new NotFoundException("Text block not found"));
  }

  @Override
  public TextBlockDto createTextBlock(TextBlockRequest request) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);

    TextBlock textBlock = new TextBlock();
    textBlock.setName(request.name());
    textBlock.setContent(request.content());

    try {
      TextBlock savedTextBlock = textBlockRepository.saveAndFlush(textBlock);
      return TextBlockMapper.toInterfaceType(savedTextBlock);
    } catch (DataIntegrityViolationException e) {
      String message =
          String.format(
              "Cannot create text block: A text block with the name %s already exists.",
              request.name());
      throw new BadRequestException(message);
    }
  }

  @Override
  public GetTextBlocksResponse getTextBlocks(TextBlockFilterParameters parameters) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    PaginationUtil.PageSpec pageSpec =
        TextBlockMapper.mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(TextBlockSortKey.NAME),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    Page<TextBlock> textBlocks;
    Specification<TextBlock> specification = withNameOrContentContaining(parameters.searchQuery());
    Pageable pageable = getPageable(pageSpec, "name");

    if (specification == null) {
      textBlocks = textBlockRepository.findAll(pageable);
    } else {
      textBlocks = textBlockRepository.findAll(specification, pageable);
    }

    return new GetTextBlocksResponse(
        TextBlockMapper.toInterfaceTypes(textBlocks.stream().toList()),
        textBlocks.getTotalElements());
  }

  @Override
  public TextBlockDto loadTextBlock(UUID textBlockId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    TextBlock textBlock = loadTextBlockEntity(textBlockId);
    return TextBlockMapper.toInterfaceType(textBlock);
  }

  @Override
  public TextBlockDto updateTextBlock(UUID textBlockId, TextBlockRequest request) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    try {
      TextBlock textBlock = loadTextBlockEntity(textBlockId);
      textBlock.setName(request.name());
      textBlock.setContent(request.content());
      TextBlock savedTextBlock = textBlockRepository.saveAndFlush(textBlock);
      return TextBlockMapper.toInterfaceType(savedTextBlock);
    } catch (DataIntegrityViolationException e) {
      String message =
          String.format(
              "Cannot edit text block: A text block with the name %s already exists.",
              request.name());
      throw new BadRequestException(message);
    }
  }

  @Override
  public void deleteTextBlock(UUID textBlockId) {
    featureToggle.assertNewFeatureIsEnabled(
        TravelMedicineFeature.CITIZEN_PORTAL_INFORMATION_STATEMENT);
    if (!textBlockRepository.existsById(textBlockId)) {
      throw new NotFoundException("Text block not found");
    }
    textBlockRepository.deleteById(textBlockId);
  }

  private static Specification<TextBlock> withNameOrContentContaining(String searchQuery) {
    if (isBlank(searchQuery)) {
      return null;
    }
    return (root, query, builder) ->
        builder.or(
            containsIgnoringCase(builder, root.get("name"), searchQuery),
            containsIgnoringCase(builder, root.get("content"), searchQuery));
  }

  private static Predicate containsIgnoringCase(
      CriteriaBuilder builder, Expression<String> expression, String queryWord) {

    return builder.like(
        expression,
        builder.literal("%" + queryWord.toLowerCase() + "%"),
        ESCAPING.getEscapeCharacter());
  }
}
