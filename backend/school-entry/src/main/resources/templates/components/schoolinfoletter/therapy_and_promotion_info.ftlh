<#import "../common/forms.ftlh" as forms />

<#macro content therapyAndPromotionInfo="NUL" >
<#-- @ftlvariable name="therapyAndPromotionInfo" type="de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterTherapyAndPromotionInfoDto" -->
  <table style="width: 100%; line-height: 1rem;">
    <colgroup>
      <col style="width: 19%" />
      <col style="width: 20%" />
      <col style="width: 22%" />
      <col style="width: 20%" />
      <col style="width: 19%" />
    </colgroup>
    <tr>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.speechTherapy title="Logopädie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.ergoTherapy title="Ergotherapie"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.physioTherapy title="Krankengymnastik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.psychoMotorSkills title="Psychomotorik"/>
      </td>
      <td>
        <@forms.checkbox checked=therapyAndPromotionInfo?isHash && therapyAndPromotionInfo.miscellaneous title="sonstiges"/>
      </td>
    </tr>
  </table>
</#macro>
