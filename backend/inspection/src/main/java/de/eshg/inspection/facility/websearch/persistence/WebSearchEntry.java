/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.persistence;

import static de.eshg.inspection.facility.websearch.WebSearchExpressions.matches;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.SortNatural;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "websearch_id"))
public class WebSearchEntry extends BaseEntityWithExternalId {

  @ManyToOne(optional = false, cascade = CascadeType.ALL)
  @JoinColumn(name = "websearch_id", referencedColumnName = "id", nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private WebSearch webSearch;

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private WebSearchEntryStatus status = WebSearchEntryStatus.NEW;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Long osmId;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Double latitude;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Double longitude;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String name;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String postalCode;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String city;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String street;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String houseNumber;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String addressAddition;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String email;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String website;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private UUID centralFileStateId;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean ignored;

  @ElementCollection
  @Column(name = "tag", nullable = false)
  @SortNatural
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @BatchSize(size = 100)
  private final SortedSet<String> tags = new TreeSet<>();

  public WebSearchEntry(
      WebSearch webSearch,
      long osmId,
      double latitude,
      double longitude,
      String name,
      String postalCode,
      String city) {
    this.webSearch = webSearch;
    this.osmId = osmId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.postalCode = postalCode;
    this.city = city;
    this.ignored = false;
  }

  public WebSearchEntry() {}

  public WebSearch getWebSearch() {
    return webSearch;
  }

  public WebSearchEntryStatus getStatus() {
    return status;
  }

  public void setStatus(WebSearchEntryStatus status) {
    this.status = status;
  }

  public WebSearchEntry withStatus(WebSearchEntryStatus status) {
    this.status = status;
    return this;
  }

  public long getOsmId() {
    return osmId;
  }

  public double getLatitude() {
    return latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public String getName() {
    return name;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public String getCity() {
    return city;
  }

  public String getStreet() {
    return street;
  }

  public WebSearchEntry withStreet(String street) {
    this.street = street;
    return this;
  }

  public String getHouseNumber() {
    return houseNumber;
  }

  public WebSearchEntry withHouseNumber(String streetNumber) {
    this.houseNumber = streetNumber;
    return this;
  }

  public String getAddressAddition() {
    return addressAddition;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public WebSearchEntry withPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
    return this;
  }

  public String getEmail() {
    return email;
  }

  public WebSearchEntry withEmail(String email) {
    this.email = email;
    return this;
  }

  public String getWebsite() {
    return website;
  }

  public WebSearchEntry withWebsite(String website) {
    this.website = website;
    return this;
  }

  public SortedSet<String> getTags() {
    return tags;
  }

  public WebSearchEntry withTags(String... tags) {
    return withTags(Set.of(tags));
  }

  public WebSearchEntry withTags(Collection<String> tags) {
    this.tags.clear();
    this.tags.addAll(tags);
    return this;
  }

  public UUID getCentralFileStateId() {
    return centralFileStateId;
  }

  public void setCentralFileStateId(UUID centralFileStateId) {
    this.centralFileStateId = centralFileStateId;
  }

  public boolean isIgnored() {
    return ignored;
  }

  public WebSearchEntry withIgnored(boolean ignored) {
    this.ignored = ignored;
    return this;
  }

  public boolean updateWithDataFrom(WebSearchEntry other) {
    boolean needsStatusChange = false;
    if (!Objects.equals(name, other.name)) {
      name = other.name;
      needsStatusChange = true;
    }
    if (!Objects.equals(postalCode, other.postalCode)) {
      postalCode = other.postalCode;
      needsStatusChange = true;
    }
    if (!Objects.equals(city, other.city)) {
      city = other.city;
      needsStatusChange = true;
    }
    if (!Objects.equals(street, other.street)) {
      street = other.street;
      needsStatusChange = true;
    }
    if (!Objects.equals(houseNumber, other.houseNumber)) {
      houseNumber = other.houseNumber;
      needsStatusChange = true;
    }
    if (!Objects.equals(addressAddition, other.addressAddition)) {
      addressAddition = other.addressAddition;
      needsStatusChange = true;
    }
    if (!Objects.equals(phoneNumber, other.phoneNumber)) {
      phoneNumber = other.phoneNumber;
      needsStatusChange = true;
    }
    if (!Objects.equals(email, other.email)) {
      email = other.email;
      needsStatusChange = true;
    }
    // the following properties don't trigger a status change because they are not relevant
    if (!Objects.equals(website, other.website)) website = other.website;
    if (isEqual(latitude, other.latitude)) latitude = other.latitude;
    if (isEqual(longitude, other.longitude)) longitude = other.longitude;
    if (!tags.equals(other.tags)) {
      tags.clear();
      tags.addAll(other.tags);
    }
    // change status
    if (needsStatusChange) {
      status = WebSearchEntryStatus.CHANGED;
    }
    return needsStatusChange;
  }

  private static final double EPSILON = 0.0000001d;

  private static boolean isEqual(double a, double b) {
    return a == b && Math.abs(a - b) < EPSILON;
  }

  public boolean matchesQuery(WebSearchQuery query) {
    return matches(this, query);
  }
}
