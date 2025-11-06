#!/usr/bin/env node

/**
 * Script para inicializar los Google Sheets con los headers correctos
 * Esto debe correr una sola vez para configurar las hojas
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import { initializeAppointmentsSheet, initializeMessagesSheet } from '../src/lib/google-sheets.js';

async function setupSheets() {
  console.log('🚀 Configurando Google Sheets...\n');

  try {
    console.log('📋 Inicializando hoja de citas...');
    await initializeAppointmentsSheet();

    console.log('💬 Inicializando hoja de mensajes...');
    await initializeMessagesSheet();

    console.log('\n✅ ¡Google Sheets configurados exitosamente!');
    console.log('\n📊 Tus hojas están listas:');
    console.log('   - Citas: https://docs.google.com/spreadsheets/d/1DuM7pokDbek98srwPamsDGNVqD6hXafO3RHwj9gPTVw/edit');
    console.log('   - Mensajes: https://docs.google.com/spreadsheets/d/1LxE0we_tfkjr7I2TplF5VALGEQRz6-zjgZxdLcsteT4/edit');

  } catch (error) {
    console.error('\n❌ Error configurando sheets:', error.message);
    process.exit(1);
  }
}

setupSheets();
