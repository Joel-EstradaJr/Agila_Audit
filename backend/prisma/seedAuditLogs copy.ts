import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Audit Logs with sample data (50+ records)
 * This creates realistic audit log entries for testing and development
 */
async function seedAuditLogs() {
  console.log('🌱 Seeding audit logs...');

  // First, ensure action types exist
  const actionTypes = await prisma.action_type.findMany();
  if (actionTypes.length === 0) {
    console.log('❌ No action types found. Please run: pnpm seed:actions first');
    return;
  }

  console.log(`✅ Found ${actionTypes.length} action types`);

  // Get specific action types by code
  const createAction = actionTypes.find(at => at.code === 'CREATE');
  const updateAction = actionTypes.find(at => at.code === 'UPDATE');
  const deleteAction = actionTypes.find(at => at.code === 'DELETE');
  const exportAction = actionTypes.find(at => at.code === 'EXPORT');
  const loginAction = actionTypes.find(at => at.code === 'LOGIN');
  const logoutAction = actionTypes.find(at => at.code === 'LOGOUT');

  // Filter only available actions
  const availableActions = [createAction, updateAction, deleteAction, exportAction, loginAction, logoutAction].filter(Boolean);
  
  if (availableActions.length === 0) {
    console.log('❌ No valid action types found');
    return;
  }

  console.log(`✅ Using ${availableActions.length} action types: ${availableActions.map(a => a?.code).join(', ')}`);

  // Sample data configurations
  const entityTypes = ['ExpenseRecord', 'RevenueRecord', 'Receipt', 'Reimbursement', 'Budget', 'Department'];
  const users = [
    'john.doe@company.com',
    'jane.smith@company.com', 
    'admin@company.com',
    'finance.manager@company.com',
    'budget.officer@company.com',
    'hr.admin@company.com',
    'dept.head@company.com'
  ];
  const ipAddresses = [
    '192.168.1.100',
    '192.168.1.101', 
    '10.0.0.25',
    '172.16.0.50',
    '192.168.2.15'
  ];

  // Generate 60 audit log records
  const auditLogs: Prisma.audit_logCreateInput[] = [];
  const totalRecords = 60;

  for (let i = 1; i <= totalRecords; i++) {
    const randomActionType = availableActions[Math.floor(Math.random() * availableActions.length)]!;
    const randomEntityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomIP = i % 7 === 0 ? undefined : ipAddresses[Math.floor(Math.random() * ipAddresses.length)]; // Some without IP
    
    // Generate random dates within the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const actionDate = new Date();
    actionDate.setDate(actionDate.getDate() - daysAgo);
    actionDate.setHours(actionDate.getHours() - hoursAgo);

    // Generate entity_id based on action type
    // For EXPORT and IMPORT, use a reference ID format
    let entityId: string;
    if (randomActionType.code === 'EXPORT') {
      const dateStr = actionDate.toISOString().split('T')[0].replace(/-/g, '');
      entityId = `EXPORT-${dateStr}-${String(i).padStart(3, '0')}`;
    } else if (randomActionType.code === 'IMPORT') {
      const dateStr = actionDate.toISOString().split('T')[0].replace(/-/g, '');
      entityId = `IMPORT-${dateStr}-${String(i).padStart(3, '0')}`;
    } else if (randomActionType.code === 'LOGIN' || randomActionType.code === 'LOGOUT') {
      // For LOGIN/LOGOUT, use session-based entity_id
      entityId = `SESSION-${randomUser.split('@')[0]}-${Date.now() + i}`;
    } else {
      entityId = `${randomEntityType.toUpperCase()}-${1000 + i}`;
    }

    // Generate realistic previous and new data based on action type
    let previousData: Prisma.InputJsonValue | undefined = undefined;
    let newData: Prisma.InputJsonValue | undefined = undefined;

    if (randomActionType.code === 'CREATE') {
      newData = {
        amount: Math.floor(Math.random() * 10000) + 100,
        status: 'pending',
        description: `New ${randomEntityType} created`,
        category: ['Travel', 'Office Supplies', 'Equipment', 'Services'][Math.floor(Math.random() * 4)],
        date: actionDate.toISOString().split('T')[0]
      };
    } else if (randomActionType.code === 'UPDATE') {
      const oldAmount = Math.floor(Math.random() * 5000) + 100;
      const newAmount = Math.floor(Math.random() * 10000) + 100;
      const oldStatus = ['pending', 'draft'][Math.floor(Math.random() * 2)];
      const newStatus = ['approved', 'rejected'][Math.floor(Math.random() * 2)];
      
      previousData = {
        amount: oldAmount,
        status: oldStatus,
        approvedBy: null
      };
      newData = {
        amount: newAmount,
        status: newStatus,
        approvedBy: randomUser
      };
    } else if (randomActionType.code === 'DELETE') {
      previousData = {
        amount: Math.floor(Math.random() * 5000) + 100,
        status: 'draft',
        description: 'Old record data',
        createdBy: randomUser
      };
    } else if (randomActionType.code === 'EXPORT') {
      // For EXPORT, new_data can contain metadata about the export
      newData = {
        format: ['CSV', 'PDF', 'XLSX'][Math.floor(Math.random() * 3)],
        recordCount: Math.floor(Math.random() * 500) + 10,
        filters: {
          dateRange: `Last ${daysAgo} days`,
          entityType: randomEntityType
        }
      };
    } else if (randomActionType.code === 'IMPORT') {
      // For IMPORT, new_data can contain metadata about the import
      newData = {
        format: ['CSV', 'XLSX'][Math.floor(Math.random() * 2)],
        recordsImported: Math.floor(Math.random() * 200) + 5,
        source: 'External System',
        validationStatus: 'passed'
      };
    } else if (randomActionType.code === 'LOGIN') {
      newData = {
        method: ['credentials', 'sso', 'oauth'][Math.floor(Math.random() * 3)],
        userAgent: 'Mozilla/5.0',
        sessionId: `sess_${Date.now() + i}`
      };
    } else if (randomActionType.code === 'LOGOUT') {
      const sessionMinutes = Math.floor(Math.random() * 480) + 10;
      previousData = {
        sessionDuration: `${sessionMinutes} minutes`,
        lastActivity: new Date(actionDate.getTime() - 60000).toISOString()
      };
    }

    auditLogs.push({
      entity_type: randomEntityType,
      entity_id: entityId,
      action_type: {
        connect: { id: randomActionType.id }
      },
      action_by: randomUser,
      action_at: actionDate,
      previous_data: previousData,
      new_data: newData,
      version: 1,
      ip_address: randomIP
    });
  }

  // Insert all audit logs
  console.log(`📝 Creating ${totalRecords} audit log records...`);
  let successCount = 0;

  for (const log of auditLogs) {
    try {
      await prisma.audit_log.create({
        data: log
      });
      successCount++;
      if (successCount % 10 === 0) {
        console.log(`   ✓ Created ${successCount}/${totalRecords} records...`);
      }
    } catch (error) {
      console.error(`❌ Error creating audit log:`, error);
    }
  }

  console.log(`✨ Audit logs seeding completed! Created ${successCount}/${totalRecords} records.`);
}

async function main() {
  try {
    await seedAuditLogs();
  } catch (error) {
    console.error('❌ Error seeding audit logs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
