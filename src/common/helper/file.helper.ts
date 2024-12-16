import { readFileSync, readdir } from 'fs';
import { Glob } from 'glob';
import { parse } from 'papaparse';
import { promisify } from 'util';
import * as fs from 'fs';

export class FileHelper {
  async csvReader<T>(path): Promise<T> {
    const csvFile = readFileSync(path);
    const csvData = csvFile.toString();

    const csvParsed = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      // dynamicTyping: true,
      transform: (value) => {
        if (value === 'TRUE') {
          return true;
        }
        if (value === 'FALSE') {
          return false;
        }

        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      },
      // transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    return <T>csvParsed.data;
  }

  getPath(dir: string) {
    const pattern = '/**/*';

    return new Promise((resolve, reject) => {
      const mg = new Glob(dir + pattern, { mark: true, sync: false }, function (
        er,
        matches,
      ) {
        resolve(matches);
      });
    });
  }

  async getFilesInDirectory(dir): Promise<string[]> {
    return new Promise((resolve) => {
      const path = `${__dirname}/../..`;
      readdir(`${path}${dir}`, (err, filenames) => {
        const result = [];
        if (!err) {
          filenames.map((item) => {
            result.push(`${path}${dir}/${item}`);
          });
        }
        resolve(result);
      });
    });
  }

  async writer(data) {
    const writeFile = promisify(fs.writeFile);
    return await writeFile(`${__dirname}/../../logs.txt`, data, 'utf8');
  }
}
