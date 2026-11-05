import { ThumbnailValue } from "@/components/video/thumbnail-picker";

export type Position = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  icon?: string;
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
  thumbnail?: ThumbnailValue;
};
