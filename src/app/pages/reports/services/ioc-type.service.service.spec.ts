import { IocTypeService } from './ioc-type.service';
import { JsonIocResponse } from '../../../shared/sdk/rest-api/model/jsonIocResponse';
import { TestBed } from '@angular/core/testing';
import { IOCTypeGroup } from '../layout/report-article-area/report-article-area.models';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('IocTypeService', () => {
  let service: IocTypeService;

  const IOCS: JsonIocResponse[] = [
    {
      iocId: 0,
      iocTypeId: 0,
      iocTypeName: 'url',
      value: 'text',
    },
    {
      iocId: 1,
      iocTypeId: 1,
      iocTypeName: 'hash',
      value: 'text',
    },
    {
      iocId: 2,
      iocTypeId: 1,
      iocTypeName: 'hash',
      value: 'text',
    },
    {
      iocId: 3,
      iocTypeId: 2,
      iocTypeName: 'filename',
      value: 'text',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IocTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get IOC types correctly', () => {
    const result = service.getTypesFromIOCs(IOCS);

    expect(result[0]).toMatchObject({
      id: 0,
      name: 'url',
      iocs: [IOCS[0]],
    } satisfies IOCTypeGroup);
    expect(result[1]).toMatchObject({
      id: 1,
      name: 'hash',
      iocs: [IOCS[1], IOCS[2]],
    } satisfies IOCTypeGroup);
    expect(result[2]).toMatchObject({
      id: 2,
      name: 'filename',
      iocs: [IOCS[3]],
    } satisfies IOCTypeGroup);
  });
});
