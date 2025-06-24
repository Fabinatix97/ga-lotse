<#import "../common/forms.ftlh" as forms />

<#macro content vaccinationInfo="NUL" >
<#-- @ftlvariable name="vaccinationInfo" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterVaccinationInfoDto" -->
  <table style="width: 100%; line-height: 1rem;">
    <colgroup>
      <col style="width: 34%" />
      <col style="width: 15%" />
      <col style="width: 51%" />
    </colgroup>
    <tr>
      <td colspan="3">
        <@forms.checkbox checked=vaccinationInfo?isHash && (vaccinationInfo.measlesProtectionComplete?? && vaccinationInfo.measlesProtectionComplete) title="Masernschutz vollständig"/>
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=vaccinationInfo?isHash && !(vaccinationInfo.measlesProtectionComplete?? && vaccinationInfo.measlesProtectionComplete) title="Masernschutz unvollständig"/>
      </td>
      <td colspan="2">
        <@forms.checkbox checked=vaccinationInfo?isHash && vaccinationInfo.measlesContraIndication title="Medizinische Kontraindikation gegen Masernimpfung besteht:"/>
      </td>
    </tr>
    <tr>
      <td>
        <@forms.checkbox checked=vaccinationInfo?isHash && vaccinationInfo.vaccinationPassNotPresented title="Impfbuch nicht vorgelegt"/>
      </td>
      <td>
        <@forms.checkbox checked=vaccinationInfo?isHash && vaccinationInfo.measlesContraIndicationDuration?? && vaccinationInfo.measlesContraIndicationDuration.name() == "PERMANENT" title="ständig"/>
      </td>
      <td>
        <#if vaccinationInfo?isHash && vaccinationInfo.measlesContraIndicationUntil??>
          <#local title = "bis zum: " + (vaccinationInfo.formattedMeaslesContraIndicationUntil() ! "_______________________________________")>
        <#else>
          <#local title = "bis zum: _______________________________________">
        </#if>
        <@forms.checkbox checked=vaccinationInfo?isHash && vaccinationInfo.measlesContraIndicationDuration?? && vaccinationInfo.measlesContraIndicationDuration.name() == "TEMPORARY" title="${title}"/>
      </td>
    </tr>
  </table>
</#macro>
