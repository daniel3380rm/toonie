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
      complete: (results) => results.data,
    });

    return <T>csvParsed.data;
  }

  getPath(dir: string): Promise<string[]> {
    const pattern = '/**/*';
    return new Promise((resolve, reject) => {
      new Glob(dir + pattern, { mark: true }, (err, matches) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(matches);
      });
    });
  }

  async getFilesInDirectory(dir: string): Promise<string[]> {
    const readdirPromise = promisify(readdir);
    try {
      const path = `${__dirname}/../..`;
      const filenames = await readdirPromise(`${path}${dir}`);
      return filenames.map((item) => `${path}${dir}/${item}`);
    } catch (error) {
      return [];
    }
  }

  async writer(data: string): Promise<void> {
    const writeFile = promisify(fs.writeFile);
    return await writeFile(`${__dirname}/../../logs.txt`, data, 'utf8');
  }
}
