/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch;

import static de.eshg.inspection.facility.websearch.WebSearchExpressions.*;
import static de.eshg.inspection.facility.websearch.persistence.WebSearchEntryStatus.DELETED;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Collectors.toUnmodifiableMap;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import de.eshg.inspection.facility.websearch.api.UpdateWebSearchEntryRequest;
import de.eshg.inspection.facility.websearch.api.WebSearchEntriesResponse;
import de.eshg.inspection.facility.websearch.api.WebSearchEntryDto;
import de.eshg.inspection.facility.websearch.api.WebSearchRequest;
import de.eshg.inspection.facility.websearch.api.WebSearchSaveQueryRequest;
import de.eshg.inspection.facility.websearch.persistence.*;
import de.eshg.lib.notification.SimpleNotificationService;
import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.topobyte.osm4j.core.model.iface.EntityContainer;
import de.topobyte.osm4j.core.model.iface.EntityType;
import de.topobyte.osm4j.core.model.iface.OsmNode;
import de.topobyte.osm4j.core.model.util.OsmModelUtil;
import de.topobyte.osm4j.pbf.seq.PbfIterator;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.MessageFormat;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WebSearchService {

  private static final Logger log = LoggerFactory.getLogger(WebSearchService.class);

  private static final DateTimeFormatter NOTIFICATION_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm:ss", Locale.GERMAN);

  private static final String ENTITY_WEB_SEARCH = "WebSearch";
  private static final String ENTITY_WEB_SEARCH_ENTRY = "WebSearchEntry";

  private static final String OSM_FIELD_NAME = "name";
  private static final String OSM_FIELD_POSTCODE = "addr:postcode";
  private static final String OSM_FIELD_STREET = "addr:street";
  private static final String OSM_FIELD_HOUSENUMBER = "addr:housenumber";
  private static final String OSM_FIELD_CITY = "addr:city";
  private static final String OSM_FIELD_CONTACT_EMAIL = "contact:email";
  private static final String OSM_FIELD_EMAIL = "email";
  private static final String OSM_FIELD_CONTACT_PHONE = "contact:phone";
  private static final String OSM_FIELD_PHONE = "phone";
  private static final String OSM_FIELD_CONTACT_WEBSITE = "contact:website";
  private static final String OSM_FIELD_WEBSITE = "website";
  private static final String OSM_FIELD_COUNTRY = "addr:country";
  private static final String OSM_FIELD_OPENINGHOURS = "opening_hours";
  private static final String OSM_FIELD_FIXME = "fixme";

  private static final List<String> knownOsmFieldsToFilterOut =
      List.of(
          OSM_FIELD_NAME,
          OSM_FIELD_POSTCODE,
          OSM_FIELD_STREET,
          OSM_FIELD_HOUSENUMBER,
          OSM_FIELD_CITY,
          OSM_FIELD_CONTACT_EMAIL,
          OSM_FIELD_EMAIL,
          OSM_FIELD_CONTACT_PHONE,
          OSM_FIELD_PHONE,
          OSM_FIELD_CONTACT_WEBSITE,
          OSM_FIELD_WEBSITE,
          OSM_FIELD_OPENINGHOURS,
          OSM_FIELD_COUNTRY,
          OSM_FIELD_FIXME);

  private final WebSearchRepository webSearchRepository;
  private final WebSearchEntryRepository webSearchEntryRepository;
  private final SimpleNotificationService notificationService;
  private final Clock clock;

  public WebSearchService(
      WebSearchRepository webSearchRepository,
      WebSearchEntryRepository webSearchEntryRepository,
      SimpleNotificationService notificationService,
      Clock clock) {
    this.webSearchRepository = webSearchRepository;
    this.webSearchEntryRepository = webSearchEntryRepository;
    this.notificationService = notificationService;
    this.clock = clock;
  }

  @NotNull
  public WebSearch findWebSearch(UUID id) {
    return webSearchRepository.findById(id).orElseThrow(WebSearchService::notFoundException);
  }

  @NotNull
  private WebSearch findWebSearchAndLock(UUID id) {
    return webSearchRepository.findAndLockById(id).orElseThrow(WebSearchService::notFoundException);
  }

  @NotNull
  public WebSearch updateWebSearch(UUID id, WebSearchRequest request) {
    WebSearch webSearch = findWebSearch(id);
    webSearch.setName(request.name());
    webSearch.setBasicURL(request.basicURL());
    webSearch.setSearchCity(request.searchCity());
    return webSearchRepository.save(webSearch);
  }

  public void deleteWebSearch(UUID id) {
    if (!webSearchRepository.existsById(id)) {
      throw notFoundException();
    }
    webSearchRepository.deleteById(id);
  }

  public WebSearch saveQuery(UUID id, WebSearchSaveQueryRequest request) {
    WebSearch webSearch = findWebSearch(id);
    if (request.queryId() == null) {
      if (isBlank(request.queryName())) {
        throw new BadRequestException("queryName is required when creating a new query");
      }
      WebSearchQuery query =
          new WebSearchQuery(
              webSearch,
              request.queryName(),
              request.facilityName(),
              request.facilityAddress(),
              request.keywords());
      webSearch.getQueries().add(query);
      // must flush early here so that id for WebSearchQuery is generated before mapping to dto
      webSearchRepository.saveAndFlush(webSearch);
    } else {
      WebSearchQuery query = findWebSearchQuery(webSearch, request.queryId());
      if (request.queryName() != null) query.setQueryName(request.queryName());
      if (request.facilityName() != null) query.setFacilityName(request.facilityName());
      if (request.facilityAddress() != null) query.setFacilityAddress(request.facilityAddress());
      if (request.keywords() != null) query.setKeywords(request.keywords());
    }
    return webSearch;
  }

  public WebSearch deleteQuery(UUID id, long queryId) {
    WebSearch webSearch = findWebSearch(id);
    boolean deleted = webSearch.getQueries().removeIf(q -> q.getId().equals(queryId));
    if (!deleted) throw new BadRequestException("query id not found: " + queryId);
    return webSearch;
  }

  private static WebSearchQuery findWebSearchQuery(WebSearch webSearch, long queryId) {
    return webSearch.getQueries().stream()
        .filter(q -> q.getId().equals(queryId))
        .findFirst()
        .orElseThrow(() -> new BadRequestException("query id not found: " + queryId));
  }

  @NotNull
  public WebSearchEntriesResponse search(UUID id, SearchParameters params) {
    WebSearch webSearch = findWebSearch(id);
    Page<WebSearchEntry> result =
        webSearchEntryRepository.findAll(
            withWebSearch(webSearch)
                .and(withName(params.name()))
                .and(withAddress(params.address()))
                .and(withStatus(params.status()))
                .and(withIgnored(params.ignored()))
                .and(withKeywords(params.keywords())),
            params.pageRequest());
    List<WebSearchEntryDto> entries = result.map(WebSearchMapper::toDto).toList();
    return new WebSearchEntriesResponse(result.getTotalPages(), result.getTotalElements(), entries);
  }

  @NotNull
  public WebSearchEntry findWebSearchEntry(UUID entryId) {
    return webSearchEntryRepository
        .findByExternalId(entryId)
        .orElseThrow(WebSearchService::entryNotFoundException);
  }

  @NotNull
  public WebSearchEntry updateWebSearchEntry(
      UUID entryId, UpdateWebSearchEntryRequest updateRequest) {
    WebSearchEntry entry = findWebSearchEntry(entryId);
    if (updateRequest.ignored() != null) {
      entry = entry.withIgnored(updateRequest.ignored());
    }
    return entry;
  }

  @NotNull
  @Transactional
  public WebSearch setRunningState(@NotNull UUID webSearchID) {
    WebSearch webSearch = findWebSearch(webSearchID);
    if (webSearch.getStatus() == WebSearchStatus.RUNNING) {
      throw new BadRequestException("this websearch is already running");
    }
    webSearch.setStatus(WebSearchStatus.RUNNING);
    webSearch.setRunningSince(Instant.now(clock));
    return webSearch;
  }

  @Transactional
  public void executeWebSearch(@NotNull UUID webSearchId, @NotNull String runType) {
    log.info("{} invocation of websearch ID {}: locking...", runType, webSearchId);
    WebSearch webSearch = findWebSearchAndLock(webSearchId);
    String logName = webSearch.getName() + " (ID: " + webSearchId + ")";
    try {
      log.info("{} invocation of websearch {}: starting...", runType, logName);
      boolean wasPausedPreviously = webSearch.getStatus() == WebSearchStatus.PAUSED;
      List<WebSearchEntry> osmEntries = searchForOsmFacilities(webSearch);

      Result result = addOrModifyEntries(webSearch, osmEntries);

      webSearch.setEntryCount(webSearch.getEntries().size());
      webSearch.setStatus(wasPausedPreviously ? WebSearchStatus.PAUSED : WebSearchStatus.IDLE);
      webSearch.setLastSuccessfulExecution(Instant.now(clock));
      webSearch.setLastError(null);
      webSearch = webSearchRepository.saveAndFlush(webSearch);

      createWebSearchFinishedNotification(webSearch, result.modified);
      createWebSearchQueryNotifications(webSearch, result.queries);
    } catch (Exception ex) {
      log.error("error executing websearch {}", logName, ex);
      webSearch.setStatus(WebSearchStatus.ERRONEOUS);
      webSearch.setLastError(ExceptionUtils.getStackTrace(ex));
      createWebSearchFailedNotification(webSearch);
    } finally {
      webSearch.setRunningSince(null);
      webSearch.setLastExecution(Instant.now(clock));
      log.info("{} invocation of websearch {}: finished.", runType, logName);
    }
  }

  private static class Result {
    private int modified = 0;
    private final Map<WebSearchQuery, QueryResult> queries = new LinkedHashMap<>();

    static class QueryResult {
      int added = 0;
      int modified = 0;
      int deleted = 0;
    }

    void incModified() {
      modified++;
    }

    void incAddedFor(WebSearchQuery query) {
      getQueryResultFor(query).added++;
    }

    void incModifiedFor(WebSearchQuery query) {
      getQueryResultFor(query).modified++;
    }

    void incDeletedFor(WebSearchQuery query) {
      getQueryResultFor(query).deleted++;
    }

    QueryResult getQueryResultFor(WebSearchQuery query) {
      return queries.computeIfAbsent(query, k -> new QueryResult());
    }
  }

  private Result addOrModifyEntries(WebSearch webSearch, List<WebSearchEntry> osmEntries) {
    Result result = new Result();
    findAddedOrModifiedEntries(webSearch, osmEntries, result);
    findDeletedEntries(webSearch, osmEntries, result);
    return result;
  }

  private static void findAddedOrModifiedEntries(
      WebSearch webSearch, List<WebSearchEntry> osmEntries, Result result) {
    List<WebSearchEntry> webSearchEntries = webSearch.getEntries();
    List<WebSearchQuery> queries = webSearch.getQueries();
    Map<Long, WebSearchEntry> oldEntriesByOsmId =
        webSearchEntries.stream().collect(toUnmodifiableMap(WebSearchEntry::getOsmId, e -> e));

    for (WebSearchEntry osmEntry : osmEntries) {
      WebSearchEntry existingEntry = oldEntriesByOsmId.get(osmEntry.getOsmId());
      if (existingEntry == null) {
        handleAddedEntry(osmEntry, webSearchEntries, queries, result);
      } else {
        handleModifiedEntry(osmEntry, existingEntry, queries, result);
      }
    }
  }

  private static void handleAddedEntry(
      WebSearchEntry osmEntry,
      List<WebSearchEntry> webSearchEntries,
      List<WebSearchQuery> queries,
      Result result) {
    osmEntry.setStatus(WebSearchEntryStatus.NEW);
    webSearchEntries.add(osmEntry);
    result.incModified();
    for (WebSearchQuery query : queries) {
      if (osmEntry.matchesQuery(query)) {
        result.incAddedFor(query);
      }
    }
  }

  private static void handleModifiedEntry(
      WebSearchEntry osmEntry,
      WebSearchEntry existingEntry,
      List<WebSearchQuery> queries,
      Result result) {
    if (existingEntry.updateWithDataFrom(osmEntry)) {
      result.incModified();
      // notify about data change, but only if entry is not ignored:
      if (!existingEntry.isIgnored()) {
        for (WebSearchQuery query : queries) {
          if (existingEntry.matchesQuery(query)) {
            result.incModifiedFor(query);
          }
        }
      }
    }
  }

  private static void findDeletedEntries(
      WebSearch webSearch, List<WebSearchEntry> osmEntries, Result result) {
    List<WebSearchEntry> webSearchEntries = webSearch.getEntries();
    List<WebSearchQuery> queries = webSearch.getQueries();
    Set<Long> osmIds = osmEntries.stream().map(WebSearchEntry::getOsmId).collect(toSet());
    // mark old entries as DELETED, if they are no longer available in the new OSM entries
    for (WebSearchEntry oldEntry : webSearchEntries) {
      if (osmIds.contains(oldEntry.getOsmId()) || oldEntry.getStatus() == DELETED) {
        continue;
      }
      oldEntry.setStatus(DELETED);
      // notify about data change, but only if entry is not ignored:
      if (!oldEntry.isIgnored()) {
        for (WebSearchQuery query : queries) {
          if (oldEntry.matchesQuery(query)) {
            result.incDeletedFor(query);
          }
        }
      }
    }
  }

  @NotNull
  public List<WebSearchEntry> searchForOsmFacilities(@NotNull WebSearch webSearch)
      throws URISyntaxException, IOException {
    List<WebSearchEntry> result = new ArrayList<>();

    // Read data from URL
    // Example: https://download.geofabrik.de/europe/germany/hessen-latest.osm.pbf
    try (InputStream input = openStreamWithHttpsUpgrade(webSearch.getBasicURL())) {
      // For the moment we assume the data to be in OSM PBF format, so we use the PbfIterator
      // For OSM XML data, we would use OsmXmlIterator(input, false).
      PbfIterator iterator = new PbfIterator(input, false);

      // Iterate contained entities
      long nodes = 0;
      for (EntityContainer container : iterator) {
        // Only use nodes
        if (container.getType() == EntityType.Node) {
          OsmNode node = (OsmNode) container.getEntity();
          handleOsmNode(webSearch, node, result);
          if ((++nodes % 100000) == 0) log.info("Processed {} nodes...", nodes);
        }
      }
      int size = result.size();
      log.info(
          "Parsing {} complete. Processed {} nodes. Found {} facilities.",
          webSearch.getBasicURL(),
          nodes,
          size);
    }

    return result;
  }

  private static InputStream openStreamWithHttpsUpgrade(String urlString)
      throws IOException, URISyntaxException {
    if (urlString.startsWith("http://") && !urlString.startsWith("http://localhost")) {
      log.info("Upgrading {} to https", urlString);
      urlString = urlString.replace("http://", "https://");
    }

    URL url = new URI(urlString).toURL();
    log.info("Parsing {} ...", url);

    HttpURLConnection connection = (HttpURLConnection) url.openConnection();

    // Manual redirect logic since Java's HttpUrlConnection won't follow redirects with protocol
    // downgrade
    if (HttpStatus.valueOf(connection.getResponseCode()).is3xxRedirection()) {
      String location = connection.getHeaderField(HttpHeaders.LOCATION);
      if (location == null) {
        throw new RuntimeException(
            "Redirect (%d) without location header".formatted(connection.getResponseCode()));
      }
      log.info("Redirected to {}", location);
      return openStreamWithHttpsUpgrade(location);
    }

    return connection.getInputStream();
  }

  private void handleOsmNode(WebSearch webSearch, OsmNode node, List<WebSearchEntry> result) {
    // Convert the node's tags to a map
    Map<String, String> tags = OsmModelUtil.getTagsAsMap(node);

    String name = tags.get(OSM_FIELD_NAME);
    String postalCode = tags.get(OSM_FIELD_POSTCODE);
    String city = tags.get(OSM_FIELD_CITY);

    if (name != null
        && postalCode != null
        && city != null
        && (isEmpty(webSearch.getSearchCity())
            || webSearch.getSearchCity().equalsIgnoreCase(city))) {
      log.info("found facility: {}", tags);

      String street = tags.get(OSM_FIELD_STREET);
      String housenumber = tags.get(OSM_FIELD_HOUSENUMBER);
      String email =
          ofNullable(tags.get(OSM_FIELD_CONTACT_EMAIL)).orElse(tags.get(OSM_FIELD_EMAIL));
      String phone =
          ofNullable(tags.get(OSM_FIELD_CONTACT_PHONE)).orElse(tags.get(OSM_FIELD_PHONE));
      String website =
          ofNullable(tags.get(OSM_FIELD_CONTACT_WEBSITE)).orElse(tags.get(OSM_FIELD_WEBSITE));

      Collection<String> allOtherTags =
          tags.entrySet().stream()
              .filter(e -> !knownOsmFieldsToFilterOut.contains(e.getKey()))
              .map(e -> e.getKey() + "=" + e.getValue())
              .toList();

      result.add(
          new WebSearchEntry(
                  webSearch,
                  node.getId(),
                  node.getLatitude(),
                  node.getLongitude(),
                  name,
                  postalCode,
                  city)
              .withStreet(street)
              .withHouseNumber(housenumber)
              .withEmail(email)
              .withPhoneNumber(phone)
              .withWebsite(website)
              .withTags(allOtherTags));
      if ((result.size() % 500) == 0) log.info("Found {} facilities...", result.size());
    }
  }

  private void createWebSearchFinishedNotification(WebSearch webSearch, int modifiedCount) {
    String notificationMessage =
        MessageFormat.format(
            "Der Suchauftrag {0} wurde um {1} abgeschlossen. "
                + "Es {2,choice,1#wurde eine Einrichtung|1<wurden {2} Einrichtungen} gefunden, "
                + "hiervon sind {3} neu oder verändert.",
            webSearch.getName(),
            webSearch
                .getLastSuccessfulExecution()
                .atZone(clock.getZone())
                .format(NOTIFICATION_FORMATTER),
            webSearch.getEntryCount(),
            modifiedCount);
    createNotification(webSearch.getCreatedBy(), "Suchauftrag abgeschlossen", notificationMessage);
  }

  private void createWebSearchFailedNotification(WebSearch webSearch) {
    String notificationMessage =
        MessageFormat.format(
            "Bei der Ausführung des Suchauftrags {0} ist ein unerwarteter Fehler aufgetreten.",
            webSearch.getName());
    createNotification(webSearch.getCreatedBy(), "Fehler während der Suche", notificationMessage);
  }

  private void createWebSearchQueryNotifications(
      WebSearch webSearch, Map<WebSearchQuery, Result.QueryResult> queries) {
    queries.forEach(
        (query, result) -> {
          String notificationMessage =
              MessageFormat.format(
                  "Bei der gespeicherten Suche \"{0}\" des Suchauftrags {1} "
                      + "{2,choice,0#wurden keine neuen Einrichtungen|1#wurde eine neue Einrichtung|1<wurden {2} neue Einrichtungen} "
                      + "gefunden. Es gibt "
                      + "{3,choice,0#keine Einrichtung|1#eine Einrichtung|1<{3} Einrichtungen} "
                      + "mit geänderten Daten"
                      + "{4,choice,0#|1# und eine Einrichtung wurde nicht mehr gefunden|1< und {4} Einrichtungen wurden nicht mehr gefunden}.",
                  query.getQueryName(),
                  webSearch.getName(),
                  result.added,
                  result.modified,
                  result.deleted);
          createNotification(
              query.getCreatedBy(), "Aktualisierte Suchergebnisse", notificationMessage);
        });
  }

  private void createNotification(UUID userId, String title, String message) {
    notificationService.addNotification(new SimpleNotification(userId, title, message));
  }

  static NotFoundException notFoundException() {
    return new NotFoundException(ENTITY_WEB_SEARCH);
  }

  static NotFoundException entryNotFoundException() {
    return new NotFoundException(ENTITY_WEB_SEARCH_ENTRY);
  }
}
