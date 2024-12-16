/* eslint-disable @typescript-eslint/ban-types */
const classPaths: Map<Function, string> = new Map();

export function Path(targetFileName: string) {
  return function (target: Function) {
    // Get the relative path from the source file to the target file
    const fullPath =
      '../..' + targetFileName.split('domain-finance')[1].replace('.ts', '');
    classPaths.set(target, fullPath);
  };
}

export function getClassPath(target: Function): string | undefined {
  return classPaths.get(target);
}
