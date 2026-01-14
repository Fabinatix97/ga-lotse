/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.textblock;

import static de.eshg.base.util.PaginationUtil.getPageable;
import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.util.PaginationUtil;
import de.eshg.inspection.textblock.mapper.TextBlockMapper;
import de.eshg.inspection.textblock.persistence.TextBlock;
import de.eshg.inspection.textblock.persistence.TextBlockRepository;
import de.eshg.inspection.textblock.persistence.TextBlock_;
import de.eshg.lib.editor.TextBlockService;
import de.eshg.lib.editor.api.model.GetTextBlocksResponse;
import de.eshg.lib.editor.api.model.TextBlockDto;
import de.eshg.lib.editor.api.model.TextBlockFilterParameters;
import de.eshg.lib.editor.api.model.TextBlockRequest;
import de.eshg.lib.editor.api.model.TextBlockSortKey;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.EscapeCharacter;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

@Service
public class TextBlockServiceImpl implements TextBlockService {
  private static final Logger log = LoggerFactory.getLogger(TextBlockServiceImpl.class);

  private static final EscapeCharacter ESCAPING = EscapeCharacter.DEFAULT;

  private final TextBlockRepository textBlockRepository;

  public TextBlockServiceImpl(TextBlockRepository textBlockRepository) {
    this.textBlockRepository = textBlockRepository;
  }

  @Override
  public TextBlockDto createTextBlock(TextBlockRequest request) {

    TextBlock textBlock = new TextBlock();
    textBlock.setName(request.name());
    textBlock.setContent(request.content());

    try {
      TextBlock savedTextBlock = textBlockRepository.saveAndFlush(textBlock);

      log.info(
          "Saved a new inspection text block, id={}, name={}, content={}",
          savedTextBlock.getId(),
          savedTextBlock.getName(),
          savedTextBlock.getContent());

      return TextBlockMapper.mapToDto(savedTextBlock);
    } catch (DataIntegrityViolationException e) {
      String message =
          String.format(
              "Cannot create text block: A text block with the name %s already exists.",
              request.name());
      throw new BadRequestException(ErrorCode.ALREADY_EXISTS, message);
    }
  }

  @Override
  public GetTextBlocksResponse getTextBlocks(TextBlockFilterParameters parameters) {
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
        TextBlockMapper.mapToDtos(textBlocks.stream().toList()), textBlocks.getTotalElements());
  }

  @Override
  public TextBlockDto loadTextBlock(UUID textBlockId) {
    TextBlock textBlock = loadTextBlockEntity(textBlockId);
    return TextBlockMapper.mapToDto(textBlock);
  }

  private TextBlock loadTextBlockEntity(UUID textBlockId) {
    return textBlockRepository
        .findById(textBlockId)
        .orElseThrow(() -> new NotFoundException("Text block not found"));
  }

  @Override
  public TextBlockDto updateTextBlock(UUID textBlockId, TextBlockRequest request) {
    try {
      TextBlock textBlock = loadTextBlockEntity(textBlockId);
      textBlock.setName(request.name());
      textBlock.setContent(request.content());
      TextBlock savedTextBlock = textBlockRepository.saveAndFlush(textBlock);
      return TextBlockMapper.mapToDto(savedTextBlock);
    } catch (DataIntegrityViolationException e) {
      String message =
          String.format(
              "Cannot edit text block: A text block with the name %s already exists.",
              request.name());
      throw new BadRequestException(ErrorCode.ALREADY_EXISTS, message);
    } catch (ObjectOptimisticLockingFailureException e) {
      String message =
          String.format(
              "The text block with the name %s and id %s is being edited concurrently.",
              request.name(), textBlockId);
      throw new BadRequestException(ErrorCode.CONFLICT, message);
    }
  }

  public void deleteTextBlock(UUID textBlockId) {
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
            containsIgnoringCase(builder, root.get(TextBlock_.name), searchQuery),
            containsIgnoringCase(builder, root.get(TextBlock_.content), searchQuery));
  }

  private static Predicate containsIgnoringCase(
      CriteriaBuilder builder, Expression<String> expression, String queryWord) {

    return builder.like(
        expression,
        builder.literal("%" + queryWord.toLowerCase() + "%"),
        ESCAPING.getEscapeCharacter());
  }
}
