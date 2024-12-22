import { readFileSync, readdir } from 'fs';
import { glob } from 'glob'; // تغییر در import
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
      // transformHeader: (header)     => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    return <T>csvParsed.data;
  }

  async getPath(dir: string) {
    const pattern = '/**/*';
    return await glob(dir + pattern, {
      mark: true,
      nodir: true,
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
