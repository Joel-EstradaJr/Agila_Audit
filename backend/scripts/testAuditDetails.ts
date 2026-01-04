// ============================================================================
// TEST SCRIPT FOR AUDIT DETAILS GENERATION
// ============================================================================
// This script demonstrates the audit details generation for all action types

import { buildAuditDetails } from '../src/utils/auditDetails.util';
import { AuditLogResponse } from '../src/types/auditLog';

console.log('='.repeat(80));
console.log('AUDIT DETAILS GENERATION TEST');
console.log('='.repeat(80));
console.log();

// Test date for consistent output
const testDate = new Date('2026-01-05T10:15:00Z');

// Test 1: CREATE action
console.log('1. CREATE Action');
console.log('-'.repeat(80));
const createLog: AuditLogResponse = {
  id: 1,
  entity_type: 'ExpenseRecord',
  entity_id: 'EXP-123',
  action_type: { id: 1, code: 'CREATE' },
  action_by: 'john.doe@company.com',
  action_at: testDate,
  previous_data: null,
  new_data: {
    amount: 1500,
    category: 'Travel',
    status: 'pending'
  },
  version: 1,
  ip_address: '192.168.1.50',
  created_at: testDate
};
console.log(buildAuditDetails(createLog));
console.log();

// Test 2: UPDATE action
console.log('2. UPDATE Action');
console.log('-'.repeat(80));
const updateLog: AuditLogResponse = {
  id: 2,
  entity_type: 'ExpenseRecord',
  entity_id: 'EXP-123',
  action_type: { id: 2, code: 'UPDATE' },
  action_by: 'jane.smith@company.com',
  action_at: new Date('2026-01-06T14:42:00Z'),
  previous_data: {
    amount: 1500,
    status: 'Pending'
  },
  new_data: {
    amount: 1800,
    status: 'Approved'
  },
  version: 2,
  ip_address: '192.168.1.51',
  created_at: new Date('2026-01-06T14:42:00Z')
};
console.log(buildAuditDetails(updateLog));
console.log();

// Test 3: DELETE action
console.log('3. DELETE Action');
console.log('-'.repeat(80));
const deleteLog: AuditLogResponse = {
  id: 3,
  entity_type: 'ExpenseRecord',
  entity_id: 'EXP-123',
  action_type: { id: 3, code: 'DELETE' },
  action_by: 'admin@company.com',
  action_at: new Date('2026-01-07T09:05:00Z'),
  previous_data: {
    amount: 1800,
    status: 'Approved',
    category: 'Travel'
  },
  new_data: null,
  version: 3,
  ip_address: '192.168.1.100',
  created_at: new Date('2026-01-07T09:05:00Z')
};
console.log(buildAuditDetails(deleteLog));
console.log();

// Test 4: EXPORT action
console.log('4. EXPORT Action');
console.log('-'.repeat(80));
const exportLog: AuditLogResponse = {
  id: 4,
  entity_type: 'AuditLog',
  entity_id: 'EXPORT-20260105-001',
  action_type: { id: 4, code: 'EXPORT' },
  action_by: 'finance.admin@company.com',
  action_at: new Date('2026-01-05T11:30:00Z'),
  previous_data: null,
  new_data: {
    format: 'CSV',
    recordCount: 250,
    filters: { dateRange: 'Last 30 days' }
  },
  version: 1,
  ip_address: '192.168.1.75',
  created_at: new Date('2026-01-05T11:30:00Z')
};
console.log(buildAuditDetails(exportLog));
console.log();

// Test 5: IMPORT action
console.log('5. IMPORT Action');
console.log('-'.repeat(80));
const importLog: AuditLogResponse = {
  id: 5,
  entity_type: 'ExpenseRecord',
  entity_id: 'IMPORT-20260105-001',
  action_type: { id: 5, code: 'IMPORT' },
  action_by: 'system',
  action_at: new Date('2026-01-05T12:10:00Z'),
  previous_data: null,
  new_data: {
    format: 'CSV',
    recordsImported: 150,
    source: 'External System'
  },
  version: 1,
  ip_address: '10.0.0.25',
  created_at: new Date('2026-01-05T12:10:00Z')
};
console.log(buildAuditDetails(importLog));
console.log();

// Test 6: LOGIN action
console.log('6. LOGIN Action');
console.log('-'.repeat(80));
const loginLog: AuditLogResponse = {
  id: 6,
  entity_type: 'UserSession',
  entity_id: 'SESSION-john.doe-1735816500000',
  action_type: { id: 6, code: 'LOGIN' },
  action_by: 'john.doe@company.com',
  action_at: new Date('2026-01-05T08:55:00Z'),
  previous_data: null,
  new_data: {
    method: 'credentials',
    userAgent: 'Mozilla/5.0'
  },
  version: 1,
  ip_address: '192.168.1.50',
  created_at: new Date('2026-01-05T08:55:00Z')
};
console.log(buildAuditDetails(loginLog));
console.log();

// Test 7: LOGOUT action
console.log('7. LOGOUT Action');
console.log('-'.repeat(80));
const logoutLog: AuditLogResponse = {
  id: 7,
  entity_type: 'UserSession',
  entity_id: 'SESSION-john.doe-1735816500000',
  action_type: { id: 7, code: 'LOGOUT' },
  action_by: 'john.doe@company.com',
  action_at: new Date('2026-01-05T17:30:00Z'),
  previous_data: {
    sessionDuration: '510 minutes'
  },
  new_data: null,
  version: 1,
  ip_address: '192.168.1.50',
  created_at: new Date('2026-01-05T17:30:00Z')
};
console.log(buildAuditDetails(logoutLog));
console.log();

// Test 8: Action with null action_by (System)
console.log('8. System Action (NULL action_by)');
console.log('-'.repeat(80));
const systemLog: AuditLogResponse = {
  id: 8,
  entity_type: 'Budget',
  entity_id: 'BUDGET-2026',
  action_type: { id: 1, code: 'CREATE' },
  action_by: null,
  action_at: new Date('2026-01-01T00:00:00Z'),
  previous_data: null,
  new_data: {
    amount: 1000000,
    fiscal_year: 2026
  },
  version: 1,
  ip_address: null,
  created_at: new Date('2026-01-01T00:00:00Z')
};
console.log(buildAuditDetails(systemLog));
console.log();

// Test 9: LOGIN without IP address
console.log('9. LOGIN without IP Address');
console.log('-'.repeat(80));
const loginNoIP: AuditLogResponse = {
  id: 9,
  entity_type: 'UserSession',
  entity_id: 'SESSION-mobile-user',
  action_type: { id: 6, code: 'LOGIN' },
  action_by: 'mobile.user@company.com',
  action_at: new Date('2026-01-05T09:30:00Z'),
  previous_data: null,
  new_data: {
    method: 'oauth'
  },
  version: 1,
  ip_address: null,
  created_at: new Date('2026-01-05T09:30:00Z')
};
console.log(buildAuditDetails(loginNoIP));
console.log();

console.log('='.repeat(80));
console.log('✅ All test cases completed successfully!');
console.log('='.repeat(80));
