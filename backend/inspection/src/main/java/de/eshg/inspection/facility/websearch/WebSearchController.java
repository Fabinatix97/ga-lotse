/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import static de.eshg.inspection.facility.websearch.SecurityHelper.runWithSecurityContextOfUser;
import static de.eshg.inspection.facility.websearch.WebSearchMapper.*;

import de.eshg.inspection.facility.websearch.api.*;
import de.eshg.inspection.facility.websearch.persistence.*;
import de.eshg.inspection.util.Executors;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = WebSearchController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "WebSearch")
public class WebSearchController {

  public static final String BASE_URL = BaseUrls.Inspection.FACILITY_CONTROLLER + "/websearch";

  private final WebSearchRepository webSearchRepository;
  private final WebSearchService webSearchService;

  /** for testing purposes only */
  private CountDownLatch testLatch;

  private static final ExecutorService executor =
      Executors.createQueueingExecutor("websearch-executor-", 100);

  public WebSearchController(
      WebSearchRepository webSearchRepository, WebSearchService webSearchService) {
    this.webSearchRepository = webSearchRepository;
    this.webSearchService = webSearchService;
  }

  /** for testing purposes only */
  void setTestLatch(CountDownLatch testLatch) {
    this.testLatch = testLatch;
  }

  @PostMapping
  @Operation(
      summary = "create a new websearch for facilities",
      description =
          "This does not start the websearch automatically. "
              + "Use POST /{id}/start to start it. "
              + "The initial status of the websearch is IDLE.")
  @Transactional
  public WebSearchDto createWebSearch(@Valid @RequestBody WebSearchRequest request) {
    WebSearch webSearch = requestToWebSearch(request);
    WebSearch saved = webSearchRepository.save(webSearch);
    return toDto(saved);
  }

  @GetMapping("/{id}")
  @Operation(summary = "get a facility websearch definition")
  @Transactional(readOnly = true)
  public WebSearchDto getWebSearchById(@PathVariable("id") UUID id) {
    return toDto(webSearchService.findWebSearch(id));
  }

  @GetMapping
  @Operation(summary = "get all facility websearch definitions")
  @Transactional(readOnly = true)
  public WebSearchOverviewResponse getWebSearchOverview() {
    List<WebSearch> list = webSearchRepository.findAll(Sort.by("name"));
    List<WebSearchOverviewEntryDto> mappedList =
        list.stream().map(WebSearchMapper::toOverviewDto).toList();
    return new WebSearchOverviewResponse(mappedList);
  }

  @GetMapping("/entry/{entryId}")
  @Operation(summary = "get a facility websearch entry")
  @Transactional(readOnly = true)
  public WebSearchEntryDto getWebSearchEntryById(@PathVariable("entryId") UUID entryId) {
    return toDto(webSearchService.findWebSearchEntry(entryId));
  }

  @PatchMapping("/entry/{entryId}")
  @Operation(summary = "update a websearch entry, e.g. for setting the ignored flag")
  @Transactional
  public WebSearchEntryDto updateWebSearchEntry(
      @PathVariable("entryId") UUID entryId,
      @Valid @RequestBody UpdateWebSearchEntryRequest updateRequest) {
    return toDto(webSearchService.updateWebSearchEntry(entryId, updateRequest));
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "update a facility websearch definition",
      description =
          "This does not start the updated websearch automatically. It will be started by a "
              + "background job at a configurable time. Use POST /{id}/start to start it manually.")
  @Transactional
  public WebSearchDto updateWebSearchById(
      @PathVariable("id") UUID id, @Valid @RequestBody WebSearchRequest request) {
    return toDto(webSearchService.updateWebSearch(id, request));
  }

  @PostMapping("/{id}/start")
  @Operation(
      summary = "start/update a websearch",
      description =
          "The status of the websearch will be set to RUNNING, and when the job is finished to "
              + "either IDLE or ERRONEOUS again.")
  public WebSearchDto startWebSearch(@PathVariable("id") UUID id) {
    WebSearch changedWebSearch = webSearchService.setRunningState(id);
    WebSearchDto webSearchDto = toDto(changedWebSearch);
    UUID userId = CurrentUserHelper.getCurrentUserId();

    executor.execute(
        () -> {
          try {
            runWithSecurityContextOfUser(
                userId, () -> webSearchService.executeWebSearch(id, "manual"));
          } finally {
            if (testLatch != null) testLatch.countDown();
          }
        });

    return webSearchDto;
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "delete a facility websearch definition")
  @Transactional
  public void deleteWebSearchById(@PathVariable("id") UUID id) {
    webSearchService.deleteWebSearch(id);
  }

  @GetMapping("/{id}/search")
  @Operation(summary = "search inside the results of a stored websearch")
  @Transactional(readOnly = true)
  public WebSearchEntriesResponse search(
      @PathVariable("id") UUID id,
      @RequestParam(name = "pageNumber", required = false, defaultValue = "0") Integer pageNumber,
      @RequestParam(name = "pageSize", required = false, defaultValue = "25") Integer pageSize,
      @RequestParam(name = "name", required = false) @Nullable String pName,
      @RequestParam(name = "address", required = false) @Nullable String pAddress,
      @RequestParam(name = "status", required = false) @Nullable WebSearchEntryStatusDto pStatus,
      @RequestParam(name = "keywords", required = false) @Nullable String pKeywords,
      @RequestParam(name = "ignored", required = false) @Nullable Boolean pIgnored,
      @RequestParam(name = "sort", required = false) @Nullable List<String> pSort) {

    final SearchParameters params =
        new SearchParameters(
            pageNumber, pageSize, pName, pAddress, pStatus, pKeywords, pIgnored, pSort);
    return webSearchService.search(id, params);
  }

  @PutMapping("/{id}/search")
  @Operation(summary = "save a query for a websearch")
  @Transactional
  public WebSearchDto saveQuery(
      @PathVariable("id") UUID id, @Valid @RequestBody WebSearchSaveQueryRequest request) {
    return toDto(webSearchService.saveQuery(id, request));
  }

  @DeleteMapping("/{id}/search/{queryId}")
  @Operation(summary = "delete a saved query")
  @Transactional
  public WebSearchDto deleteQuery(
      @PathVariable("id") UUID id, @PathVariable("queryId") long queryId) {
    return toDto(webSearchService.deleteQuery(id, queryId));
  }
}
