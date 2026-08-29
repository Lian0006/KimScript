import { db } from './db';
import { users } from '@shared/schema';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connected successfully!');
    console.log('📊 Users table accessible');
    console.log('👥 Sample users count:', result.length);
    
    // Test if table exists and show schema info
    const tableInfo = await db.execute`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Users table structure:');
    console.table(tableInfo.rows);
    
    return {
      connected: true,
      usersCount: result.length,
      tableStructure: tableInfo.rows
    };
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return {
      connected: false,
      error: (error as Error).message
    };
  }
}