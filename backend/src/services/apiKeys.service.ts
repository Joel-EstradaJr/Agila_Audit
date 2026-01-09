// ============================================================================
// API KEYS SERVICE - SERVICE-TO-SERVICE AUTHENTICATION
// ============================================================================

import prisma from '../prisma/client';
import { hashValue, generateApiKey } from '../utils/hash.util';
import { CreateApiKeyDTO, ApiKeyValidationResult } from '../types/auditLog';

/**
 * Create a new API key
 */
export async function createApiKey(data: CreateApiKeyDTO): Promise<{
  id: number;
  rawKey: string;
  serviceName: string;
}> {
  const rawKey = generateApiKey(data.serviceName);
  const keyHash = hashValue(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      keyHash,
      serviceName: data.serviceName,
      canWrite: data.canWrite ?? true,
      canRead: data.canRead ?? true,
      createdBy: data.createdBy,
    },
  });

  return {
    id: apiKey.id,
    rawKey, // Return raw key only once
    serviceName: apiKey.serviceName,
  };
}

/**
 * Validate an API key
 */
export async function validateApiKey(rawKey: string): Promise<ApiKeyValidationResult> {
  try {
    const keyHash = hashValue(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      select: {
        id: true,
        serviceName: true,
        canWrite: true,
        canRead: true,
        isActive: true,
      },
    });

    if (!apiKey) {
      return {
        isValid: false,
        error: 'API key not found',
      };
    }

    if (!apiKey.isActive) {
      return {
        isValid: false,
        error: 'API key has been revoked',
      };
    }

    return {
      isValid: true,
      apiKey: {
        id: apiKey.id,
        serviceName: apiKey.serviceName,
        canWrite: apiKey.canWrite,
        canRead: apiKey.canRead,
      },
    };
  } catch (error: any) {
    console.error('API key validation error:', error);
    return {
      isValid: false,
      error: 'Validation failed',
    };
  }
}

/**
 * List all API keys (admin only)
 */
export async function listApiKeys(): Promise<any[]> {
  return await prisma.apiKey.findMany({
    select: {
      id: true,
      serviceName: true,
      canWrite: true,
      canRead: true,
      isActive: true,
      createdAt: true,
      createdBy: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(id: number): Promise<void> {
  await prisma.apiKey.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}

/**
 * Delete an API key permanently (SuperAdmin only)
 */
export async function deleteApiKey(id: number): Promise<void> {
  await prisma.apiKey.delete({
    where: { id },
  });
}

/**
 * Get API key by ID
 */
export async function getApiKeyById(id: number): Promise<any | null> {
  return await prisma.apiKey.findUnique({
    where: { id },
    select: {
      id: true,
      serviceName: true,
      canWrite: true,
      canRead: true,
      isActive: true,
      createdAt: true,
      createdBy: true,
      updatedAt: true,
    },
  });
}
