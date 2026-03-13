/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import static jakarta.persistence.CascadeType.PERSIST;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.i18n.Language;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.util.Objects;
import java.util.Optional;
import org.springframework.util.Assert;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class MultiLangDocument extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = PERSIST, orphanRemoval = true)
  private Document de;

  @Column(nullable = false)
  private int deFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document en;

  @Column private Integer enFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document es;

  @Column private Integer esFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document tr;

  @Column private Integer trFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document ru;

  @Column private Integer ruFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document ar;

  @Column private Integer arFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document fr;

  @Column private Integer frFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document it;

  @Column private Integer itFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document pl;

  @Column private Integer plFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document ro;

  @Column private Integer roFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document uk;

  @Column private Integer ukFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document hr;

  @Column private Integer hrFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document fa;

  @Column private Integer faFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document prs;

  @Column private Integer prsFileSizeBytes;

  public Document get(Language language) {
    return switch (language) {
      case GERMAN -> de;
      case ENGLISH -> en;
      case SPANISH -> es;
      case TURKISH -> tr;
      case RUSSIAN -> ru;
      case ARABIC -> ar;
      case FRENCH -> fr;
      case ITALIAN -> it;
      case POLISH -> pl;
      case ROMANIAN -> ro;
      case UKRAINIAN -> uk;
      case CROATIAN -> hr;
      case FARSI -> fa;
      case DARI -> prs;
    };
  }

  public Integer getFileSizeBytes(Language language) {
    return switch (language) {
      case GERMAN -> deFileSizeBytes;
      case ENGLISH -> enFileSizeBytes;
      case SPANISH -> esFileSizeBytes;
      case TURKISH -> trFileSizeBytes;
      case RUSSIAN -> ruFileSizeBytes;
      case ARABIC -> arFileSizeBytes;
      case FRENCH -> frFileSizeBytes;
      case ITALIAN -> itFileSizeBytes;
      case POLISH -> plFileSizeBytes;
      case ROMANIAN -> roFileSizeBytes;
      case UKRAINIAN -> ukFileSizeBytes;
      case CROATIAN -> hrFileSizeBytes;
      case FARSI -> faFileSizeBytes;
      case DARI -> prsFileSizeBytes;
    };
  }

  public void update(Language language, byte[] fileContent) {
    switch (language) {
      case GERMAN -> {
        Assert.state(fileContent != null, "Set deFileContent must not be null");
        de = new Document();
        de.setContent(fileContent);
        deFileSizeBytes = fileContent.length;
      }
      case ENGLISH -> {
        if (fileContent == null) {
          en = null;
          enFileSizeBytes = null;
        } else {
          en = new Document();
          en.setContent(fileContent);
          enFileSizeBytes = fileContent.length;
        }
      }

      case SPANISH -> {
        if (fileContent == null) {
          es = null;
          esFileSizeBytes = null;
        } else {
          es = new Document();
          es.setContent(fileContent);
          esFileSizeBytes = fileContent.length;
        }
      }
      case TURKISH -> {
        if (fileContent == null) {
          tr = null;
          trFileSizeBytes = null;
        } else {
          tr = new Document();
          tr.setContent(fileContent);
          trFileSizeBytes = fileContent.length;
        }
      }
      case RUSSIAN -> {
        if (fileContent == null) {
          ru = null;
          ruFileSizeBytes = null;
        } else {
          ru = new Document();
          ru.setContent(fileContent);
          ruFileSizeBytes = fileContent.length;
        }
      }
      case ARABIC -> {
        if (fileContent == null) {
          ar = null;
          arFileSizeBytes = null;
        } else {
          ar = new Document();
          ar.setContent(fileContent);
          arFileSizeBytes = fileContent.length;
        }
      }
      case FRENCH -> {
        if (fileContent == null) {
          fr = null;
          frFileSizeBytes = null;
        } else {
          fr = new Document();
          fr.setContent(fileContent);
          frFileSizeBytes = fileContent.length;
        }
      }
      case ITALIAN -> {
        if (fileContent == null) {
          it = null;
          itFileSizeBytes = null;
        } else {
          it = new Document();
          it.setContent(fileContent);
          itFileSizeBytes = fileContent.length;
        }
      }
      case POLISH -> {
        if (fileContent == null) {
          pl = null;
          plFileSizeBytes = null;
        } else {
          pl = new Document();
          pl.setContent(fileContent);
          plFileSizeBytes = fileContent.length;
        }
      }
      case ROMANIAN -> {
        if (fileContent == null) {
          ro = null;
          roFileSizeBytes = null;
        } else {
          ro = new Document();
          ro.setContent(fileContent);
          roFileSizeBytes = fileContent.length;
        }
      }
      case UKRAINIAN -> {
        if (fileContent == null) {
          uk = null;
          ukFileSizeBytes = null;
        } else {
          uk = new Document();
          uk.setContent(fileContent);
          ukFileSizeBytes = fileContent.length;
        }
      }
      case CROATIAN -> {
        if (fileContent == null) {
          hr = null;
          hrFileSizeBytes = null;
        } else {
          hr = new Document();
          hr.setContent(fileContent);
          hrFileSizeBytes = fileContent.length;
        }
      }
      case FARSI -> {
        if (fileContent == null) {
          fa = null;
          faFileSizeBytes = null;
        } else {
          fa = new Document();
          fa.setContent(fileContent);
          faFileSizeBytes = fileContent.length;
        }
      }
      case DARI -> {
        if (fileContent == null) {
          prs = null;
          prsFileSizeBytes = null;
        } else {
          prs = new Document();
          prs.setContent(fileContent);
          prsFileSizeBytes = fileContent.length;
        }
      }
    }
  }

  public void update(Language language, Document document) {
    if (Objects.requireNonNull(language) == Language.GERMAN) {
      update(language, document.getContent());
    } else {
      update(language, Optional.ofNullable(document).map(Document::getContent).orElse(null));
    }
  }

  public boolean isComplete() {
    return de != null
        && en != null
        && es != null
        && tr != null
        && ru != null
        && ar != null
        && fr != null
        && it != null
        && pl != null
        && ro != null
        && uk != null
        && hr != null
        && fa != null
        && prs != null;
  }
}
