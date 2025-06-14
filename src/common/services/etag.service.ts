import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class ETagService {
  /**
   * Generates Ed-Fi compliant ETag from timestamp
   */
  generateETag(timestamp: Date): string {
    return `"${timestamp.toISOString()}"`;
  }

  /**
   * Parses ETag string to Date object
   */
  parseETag(etag: string): Date {
    try {
      // Remove quotes from ETag: "2025-05-29T07:53:44.000Z" -> 2025-05-29T07:53:44.000Z
      const cleanETag = etag.replace(/"/g, '');
      return new Date(cleanETag);
    } catch (error) {
      throw new BadRequestException('Invalid ETag format');
    }
  }

  /**
   * Validates If-Match header for concurrency control
   * Used in PUT/DELETE operations
   */
  validateIfMatch(ifMatchHeader: string, currentETag: string): void {
    if (!ifMatchHeader) {
      throw new BadRequestException('If-Match header is required for updates');
    }

    if (ifMatchHeader !== currentETag && ifMatchHeader !== '*') {
      throw new ConflictException('Resource has been modified by another user. Please retrieve the latest version.');
    }
  }

  /**
   * Validates If-None-Match header
   * Used in POST operations to prevent duplicates
   */
  validateIfNoneMatch(ifNoneMatchHeader: string, existingETag?: string): void {
    if (ifNoneMatchHeader && existingETag && ifNoneMatchHeader === existingETag) {
      throw new ConflictException('Resource already exists with this version');
    }
  }

  /**
   * Checks if resource has been modified since given ETag
   */
  isModifiedSince(currentETag: string, clientETag: string): boolean {
    if (!clientETag || !currentETag) return true;
    
    try {
      const currentDate = this.parseETag(currentETag);
      const clientDate = this.parseETag(clientETag);
      return currentDate > clientDate;
    } catch {
      return true; // If parsing fails, assume modified
    }
  }
}