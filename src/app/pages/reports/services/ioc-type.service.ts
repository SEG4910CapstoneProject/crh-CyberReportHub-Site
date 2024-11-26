import { Injectable } from '@angular/core';
import { JsonIocResponse } from '../../../shared/sdk/rest-api/model/jsonIocResponse';
import { IOCTypeGroup } from '../layout/report-article-area/report-article-area.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IocTypeService {
  public getTypesFromIOCs(iocs: JsonIocResponse[]): IOCTypeGroup[] {
    const resultMap: Record<string, IOCTypeGroup> = {};

    const copiedIOCs = structuredClone(iocs);

    for (const ioc of copiedIOCs) {
      if (ioc.iocTypeId == undefined) {
        ioc.iocTypeName = environment.nullArticleCategoryName;
      }

      if (resultMap[ioc.iocTypeId] == null) {
        resultMap[ioc.iocTypeId] = {
          id: ioc.iocTypeId,
          name: ioc.iocTypeName,
          iocs: [],
        };
      }

      resultMap[ioc.iocTypeId].iocs.push(ioc);
    }

    return Object.values(resultMap);
  }
}
