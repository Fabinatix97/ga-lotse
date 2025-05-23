<#macro style>
  .subtitle {
    font-size: 1.0rem;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 2mm;
  }

  .nameAndDateOfBirth {
    font-size: 1.3rem;
    margin-right: 2mm;
  }
  .name, .dateOfBirth {
    font-weight: 800;
  }
</#macro>

<#macro content child date schoolYear>
<#-- @ftlvariable name="child" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterChild" -->
<#-- @ftlvariable name="date" type="java.lang.String" -->
<#-- @ftlvariable name="schoolYear" type="java.lang.String" -->
  <div class="subtitle">B. Schulinfobrief / Schulärztliches Gutachten</div>
  <div class="title">Einschulungsuntersuchung ${schoolYear}</div>
  <span class="nameAndDateOfBirth"><span class="name">${child.name}</span> geb. <span
      class="dateOfBirth">${child.dateOfBirth}</span></span><span>Untersuchungsdatum ${date}</span>
</#macro>
