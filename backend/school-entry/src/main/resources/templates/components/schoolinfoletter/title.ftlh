<#macro style>
  .small-font {
    font-size: 9pt;
  }

  .title {
    font-size: 14pt;
    font-weight: 800;
    margin-top: 3mm;
    margin-bottom: 3mm;
  }

  .nameAndDateOfBirth {
    font-size: 10pt;
    margin-right: 2mm;
  }
  .name, .dateOfBirth {
    font-weight: 600;
  }
</#macro>

<#macro content child date schoolYear>
<#-- @ftlvariable name="child" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterChild" -->
<#-- @ftlvariable name="date" type="java.lang.String" -->
<#-- @ftlvariable name="schoolYear" type="java.lang.String" -->
  <div class="small-font">Schulinfobrief / Schulärztliches Gutachten</div>
  <div class="title">Einschulungsuntersuchung ${schoolYear}</div>
  <span class="nameAndDateOfBirth"><span class="name">${child.name}</span> geb. <span
      class="dateOfBirth">${child.dateOfBirth}</span></span>
  <span class="small-font">Untersuchungsdatum ${date}</span>
</#macro>
