import { Result } from "../lib/result.js";
import { EntryError } from "../lib/errors.js";
import { PrismaClient, Entry } from "@prisma/client";



const prisma = new PrismaClient();

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class EntryRepository {
  async search(query: string): Promise<Result<Entry[]>> {
    try {
      const entries = await prisma.entry.findMany({
        where: {
          content: {
            contains: query,
            mode: "insensitive", // optional: case-insensitive search
          },
        },
      });

      return {
        success: true,
        data: entries,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

// Canonical entry shape used by controllers/views.
export type Entry = {
  id: number;
  title: string;
  body: string;
  tag: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEntryInput = {
  title: string;
  body: string;
  tag?: string;
};

// Repository contract: storage operations with explicit success/error values.
export interface IEntryRepository {
  add(input: CreateEntryInput): Promise<Result<Entry, EntryError>>;
  getById(id: number): Promise<Result<Entry, EntryError>>;
  getAll(): Promise<Result<Entry[], EntryError>>;
}
