export type Position = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: any;
  lastUpdatedAt?: any;
};

export type Candidate = {
  id: string;
  name: string;
  lastName: string;
  resumeUrl: string;
  videoUrl: string;
  createdAt?: any;
  lastUpdatedAt?: any;
  position: Position | null;
  hasHeadband?: boolean;
  // Presence/absence of this field (defined vs. undefined) drives whether
  // a thumbnail renders — the old `hasThumbnail` flag is gone.
  thumbnail?: string;
};
