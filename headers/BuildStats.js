// @flow

export type BuildStats = {
  gitCommit: {
    hash: string,
    branch: string
  },
  host: string,
  time: number
};
