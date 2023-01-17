export class FsAccessFileNotExists extends Error {
  constructor(path: string) {
    super(`${path} does not exist`)
  }
}