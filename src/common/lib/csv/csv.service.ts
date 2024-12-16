import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse, unparse } from 'papaparse';
import { csvConfig } from './csv-config';

@Injectable()
export class CsvService {
  async import(path: string, validField: string[]): Promise<any[]> {
    const file = createReadStream(path, 'utf8');
    return new Promise((resolve, reject) => {
      parse(file, {
        ...csvConfig,
        header: true,
        complete: (result) => {
          validField.map((field) => {
            if (!result.meta.fields.includes(field)) {
              reject(field + ' is not exists in template');
            }
          });
          resolve(result.data);
        },
        error(err) {
          reject(err);
        },
      });
    });
  }

  async importWithOutValidation(path: string): Promise<any[]> {
    const file = createReadStream(path, 'utf8');
    return new Promise((resolve, reject) => {
      parse(file, {
        ...csvConfig,
        header: false,
        complete: (result) => {
          resolve(result.data);
        },
        error(err) {
          reject(err);
        },
      });
    });
  }

  async template(obj: object): Promise<string> {
    return new Promise((resolve) => {
      const objKeys = Object.keys(obj);
      const csvTemplate = objKeys.join(',');

      resolve(csvTemplate);
    });
  }

  async genTemplate(headers: string[]) {
    return unparse(
      { fields: headers, data: [] },
      {
        ...csvConfig,
        quotes: false,
        columns: headers,
      },
    );
  }

  async export(headers: string[], data: any[]): Promise<string> {
    return unparse(
      { fields: headers, data },
      {
        ...csvConfig,
        quotes: false,
        columns: headers,
      },
    );
  }
}
