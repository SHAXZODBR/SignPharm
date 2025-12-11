import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import BetterSqlite3 from 'better-sqlite3'
import path from 'path'

// Create SQLite connection
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const sqliteDb = new BetterSqlite3(dbPath)
const adapter = new PrismaBetterSqlite3(sqliteDb)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.drug.deleteMany()
  await prisma.pharmacy.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.atxCategory.deleteMany()
  await prisma.settings.deleteMany()

  // ========== ATX Categories ==========
  console.log('📦 Creating ATX categories...')
  const atxCategories = await Promise.all([
    prisma.atxCategory.create({ data: { code: 'A', level: 1, nameRu: 'Пищеварительный тракт и обмен веществ', nameUz: "Ovqat hazm qilish va moddalar almashinuvi", nameEn: 'Alimentary tract and metabolism' } }),
    prisma.atxCategory.create({ data: { code: 'B', level: 1, nameRu: 'Кровь и система кроветворения', nameUz: 'Qon va qon hosil qilish tizimi', nameEn: 'Blood and blood forming organs' } }),
    prisma.atxCategory.create({ data: { code: 'C', level: 1, nameRu: 'Сердечно-сосудистая система', nameUz: 'Yurak-qon tomir tizimi', nameEn: 'Cardiovascular system' } }),
    prisma.atxCategory.create({ data: { code: 'D', level: 1, nameRu: 'Дерматологические препараты', nameUz: 'Dermatologik preparatlar', nameEn: 'Dermatologicals' } }),
    prisma.atxCategory.create({ data: { code: 'G', level: 1, nameRu: 'Мочеполовая система', nameUz: 'Siydik-jinsiy tizim', nameEn: 'Genito-urinary system' } }),
    prisma.atxCategory.create({ data: { code: 'H', level: 1, nameRu: 'Гормональные препараты', nameUz: 'Gormonal preparatlar', nameEn: 'Systemic hormonal preparations' } }),
    prisma.atxCategory.create({ data: { code: 'J', level: 1, nameRu: 'Противомикробные препараты', nameUz: 'Antimikrob preparatlar', nameEn: 'Antiinfectives for systemic use' } }),
    prisma.atxCategory.create({ data: { code: 'L', level: 1, nameRu: 'Противоопухолевые препараты', nameUz: "O'simtalarga qarshi preparatlar", nameEn: 'Antineoplastic agents' } }),
    prisma.atxCategory.create({ data: { code: 'M', level: 1, nameRu: 'Костно-мышечная система', nameUz: 'Suyak-mushak tizimi', nameEn: 'Musculoskeletal system' } }),
    prisma.atxCategory.create({ data: { code: 'N', level: 1, nameRu: 'Нервная система', nameUz: 'Nerv tizimi', nameEn: 'Nervous system' } }),
    prisma.atxCategory.create({ data: { code: 'P', level: 1, nameRu: 'Противопаразитарные препараты', nameUz: 'Parazitlarga qarshi preparatlar', nameEn: 'Antiparasitic products' } }),
    prisma.atxCategory.create({ data: { code: 'R', level: 1, nameRu: 'Дыхательная система', nameUz: 'Nafas olish tizimi', nameEn: 'Respiratory system' } }),
    prisma.atxCategory.create({ data: { code: 'S', level: 1, nameRu: 'Органы чувств', nameUz: 'Sezgi organlari', nameEn: 'Sensory organs' } }),
    prisma.atxCategory.create({ data: { code: 'V', level: 1, nameRu: 'Разные препараты', nameUz: 'Turli preparatlar', nameEn: 'Various' } }),
  ])

  // ========== Suppliers ==========
  console.log('🚚 Creating suppliers...')
  const suppliers = await Promise.all([
    prisma.supplier.create({ data: { nameRu: 'Узфарма', nameUz: 'Uzfarma', nameEn: 'Uzpharma', country: 'Uzbekistan', type: 'MANUFACTURER', contactPerson: 'Aliev Rustam', phone: '+998 71 256-78-90', email: 'info@uzpharma.uz', address: 'Tashkent, Chilanzar', taxId: '123456789', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Нобель Фарма', nameUz: 'Nobel Farma', nameEn: 'Nobel Pharma', country: 'Turkey', type: 'DISTRIBUTOR', contactPerson: 'Mehmet Yilmaz', phone: '+90 212 555-12-34', email: 'info@nobelpharma.com', address: 'Istanbul', taxId: '987654321', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Сандоз', nameUz: 'Sandoz', nameEn: 'Sandoz', country: 'Switzerland', type: 'MANUFACTURER', contactPerson: 'Hans Mueller', phone: '+41 61 324-25-26', email: 'orders@sandoz.com', address: 'Basel', taxId: 'CHE123456', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Доктор Реддис', nameUz: "Dr. Reddy's", nameEn: "Dr. Reddy's", country: 'India', type: 'MANUFACTURER', contactPerson: 'Raj Patel', phone: '+91 40 4900-2900', email: 'export@drreddys.com', address: 'Hyderabad', taxId: 'IND456789', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Байер', nameUz: 'Bayer', nameEn: 'Bayer', country: 'Germany', type: 'MANUFACTURER', contactPerson: 'Klaus Schmidt', phone: '+49 214 30-1', email: 'pharma@bayer.com', address: 'Leverkusen', taxId: 'DE123456789', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Биоком', nameUz: 'Biokom', nameEn: 'Biokom', country: 'Russia', type: 'IMPORTER', contactPerson: 'Sergeev P.A.', phone: '+7 495 123-45-67', email: 'sales@biokom.ru', address: 'Moscow', taxId: 'RU987654321', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Тева', nameUz: 'Teva', nameEn: 'Teva Pharmaceuticals', country: 'Israel', type: 'MANUFACTURER', contactPerson: 'David Cohen', phone: '+972 3 926-7267', email: 'orders@teva.com', address: 'Tel Aviv', taxId: 'IL555666777', isActive: true } }),
    prisma.supplier.create({ data: { nameRu: 'Новартис', nameUz: 'Novartis', nameEn: 'Novartis', country: 'Switzerland', type: 'MANUFACTURER', contactPerson: 'Emma Brunner', phone: '+41 61 324-11-11', email: 'export@novartis.com', address: 'Basel', taxId: 'CHE789012', isActive: true } }),
  ])

  // ========== Pharmacies ==========
  console.log('🏥 Creating pharmacies...')
  const pharmacies = await Promise.all([
    prisma.pharmacy.create({ data: { nameRu: 'Аптека №1 - Центральная', nameUz: 'Dorixona №1 - Markaziy', nameEn: 'Pharmacy #1 - Central', region: 'Tashkent', district: 'Chilanzar', address: 'Katartal St, 28', phone: '+998 71 123-45-67', email: 'apteka1@pharma.uz', manager: 'Ivanova A.S.', isActive: true } }),
    prisma.pharmacy.create({ data: { nameRu: 'Аптека №2 - Юнусабад', nameUz: 'Dorixona №2 - Yunusobod', nameEn: 'Pharmacy #2 - Yunusabad', region: 'Tashkent', district: 'Yunusabad', address: 'Amir Temur Ave, 108', phone: '+998 71 234-56-78', email: 'apteka2@pharma.uz', manager: 'Petrov I.V.', isActive: true } }),
    prisma.pharmacy.create({ data: { nameRu: 'Аптека №3 - Сергели', nameUz: 'Dorixona №3 - Sergeli', nameEn: 'Pharmacy #3 - Sergeli', region: 'Tashkent', district: 'Sergeli', address: 'Mustaqillik St, 45', phone: '+998 71 345-67-89', email: 'apteka3@pharma.uz', manager: 'Sidorova M.K.', isActive: true } }),
    prisma.pharmacy.create({ data: { nameRu: 'Аптека №4 - Самарканд', nameUz: 'Dorixona №4 - Samarqand', nameEn: 'Pharmacy #4 - Samarkand', region: 'Samarkand', district: 'Center', address: 'Registan Ave, 12', phone: '+998 66 123-45-67', email: 'apteka4@pharma.uz', manager: 'Aliev R.Sh.', isActive: true } }),
    prisma.pharmacy.create({ data: { nameRu: 'Аптека №5 - Бухара', nameUz: 'Dorixona №5 - Buxoro', nameEn: 'Pharmacy #5 - Bukhara', region: 'Bukhara', district: 'Center', address: 'Navoi St, 5', phone: '+998 65 221-33-44', email: 'apteka5@pharma.uz', manager: 'Karimov O.T.', isActive: true } }),
  ])

  // ========== Drugs (Comprehensive list) ==========
  console.log('💊 Creating drugs...')
  const drugs = await Promise.all([
    // Analgesics (N02)
    prisma.drug.create({ data: { nameRu: 'Парацетамол', nameUz: 'Paratsetamol', nameEn: 'Paracetamol', inn: 'Paracetamolum', atxCode: 'N02BE01', therapeuticGroup: 'Analgesics', form: 'Tablets', dosage: '500mg', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000001', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Парацетамол Детский', nameUz: 'Paratsetamol Bolalar uchun', nameEn: 'Paracetamol Pediatric', inn: 'Paracetamolum', atxCode: 'N02BE01', therapeuticGroup: 'Analgesics', form: 'Syrup', dosage: '120mg/5ml', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000002', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Анальгин', nameUz: 'Analgin', nameEn: 'Analgin', inn: 'Metamizolum natricum', atxCode: 'N02BB02', therapeuticGroup: 'Analgesics', form: 'Tablets', dosage: '500mg', manufacturer: 'Biokom', country: 'Russia', barcode: '8600000000003', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Кетанов', nameUz: 'Ketanov', nameEn: 'Ketanov', inn: 'Ketorolacum', atxCode: 'M01AB15', therapeuticGroup: 'NSAIDs', form: 'Tablets', dosage: '10mg', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000004', prescription: true } }),
    
    // NSAIDs (M01)
    prisma.drug.create({ data: { nameRu: 'Ибупрофен', nameUz: 'Ibuprofen', nameEn: 'Ibuprofen', inn: 'Ibuprofenum', atxCode: 'M01AE01', therapeuticGroup: 'NSAIDs', form: 'Tablets', dosage: '400mg', manufacturer: 'Nobel Pharma', country: 'Turkey', barcode: '8600000000010', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Диклофенак', nameUz: 'Diklofenak', nameEn: 'Diclofenac', inn: 'Diclofenacum', atxCode: 'M01AB05', therapeuticGroup: 'NSAIDs', form: 'Tablets', dosage: '50mg', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000011', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Диклофенак Гель', nameUz: 'Diklofenak Gel', nameEn: 'Diclofenac Gel', inn: 'Diclofenacum', atxCode: 'M02AA15', therapeuticGroup: 'NSAIDs', form: 'Gel', dosage: '1%', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000012', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Нимесулид', nameUz: 'Nimesulid', nameEn: 'Nimesulide', inn: 'Nimesulidum', atxCode: 'M01AX17', therapeuticGroup: 'NSAIDs', form: 'Tablets', dosage: '100mg', manufacturer: "Dr. Reddy's", country: 'India', barcode: '8600000000013', prescription: true } }),
    
    // Antibiotics (J01)
    prisma.drug.create({ data: { nameRu: 'Амоксициллин', nameUz: 'Amoksitsillin', nameEn: 'Amoxicillin', inn: 'Amoxicillinum', atxCode: 'J01CA04', therapeuticGroup: 'Antibiotics', form: 'Capsules', dosage: '500mg', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000020', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Амоксиклав', nameUz: 'Amoksiklav', nameEn: 'Amoxiclav', inn: 'Amoxicillinum + Acidum clavulanicum', atxCode: 'J01CR02', therapeuticGroup: 'Antibiotics', form: 'Tablets', dosage: '625mg', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000021', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Цефтриаксон', nameUz: 'Seftriakson', nameEn: 'Ceftriaxone', inn: 'Ceftriaxonum', atxCode: 'J01DD04', therapeuticGroup: 'Antibiotics', form: 'Powder', dosage: '1g', manufacturer: 'Biokom', country: 'Russia', barcode: '8600000000022', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Азитромицин', nameUz: 'Azitromitsin', nameEn: 'Azithromycin', inn: 'Azithromycinum', atxCode: 'J01FA10', therapeuticGroup: 'Antibiotics', form: 'Tablets', dosage: '500mg', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000023', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Ципрофлоксацин', nameUz: 'Siprofloksatsin', nameEn: 'Ciprofloxacin', inn: 'Ciprofloxacinum', atxCode: 'J01MA02', therapeuticGroup: 'Antibiotics', form: 'Tablets', dosage: '500mg', manufacturer: 'Bayer', country: 'Germany', barcode: '8600000000024', prescription: true } }),
    
    // Cardiovascular (C)
    prisma.drug.create({ data: { nameRu: 'Аспирин Кардио', nameUz: 'Aspirin Kardio', nameEn: 'Aspirin Cardio', inn: 'Acidum acetylsalicylicum', atxCode: 'B01AC06', therapeuticGroup: 'Antiplatelets', form: 'Tablets', dosage: '100mg', manufacturer: 'Bayer', country: 'Germany', barcode: '8600000000030', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Амлодипин', nameUz: 'Amlodipin', nameEn: 'Amlodipine', inn: 'Amlodipinum', atxCode: 'C08CA01', therapeuticGroup: 'Calcium channel blockers', form: 'Tablets', dosage: '5mg', manufacturer: 'Novartis', country: 'Switzerland', barcode: '8600000000031', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Лизиноприл', nameUz: 'Lizinopril', nameEn: 'Lisinopril', inn: 'Lisinoprilum', atxCode: 'C09AA03', therapeuticGroup: 'ACE inhibitors', form: 'Tablets', dosage: '10mg', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000032', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Эналаприл', nameUz: 'Enalapril', nameEn: 'Enalapril', inn: 'Enalaprilum', atxCode: 'C09AA02', therapeuticGroup: 'ACE inhibitors', form: 'Tablets', dosage: '20mg', manufacturer: "Dr. Reddy's", country: 'India', barcode: '8600000000033', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Бисопролол', nameUz: 'Bisoprolol', nameEn: 'Bisoprolol', inn: 'Bisoprololum', atxCode: 'C07AB07', therapeuticGroup: 'Beta blockers', form: 'Tablets', dosage: '5mg', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000034', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Аторвастатин', nameUz: 'Atorvastatin', nameEn: 'Atorvastatin', inn: 'Atorvastatinum', atxCode: 'C10AA05', therapeuticGroup: 'Statins', form: 'Tablets', dosage: '20mg', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000035', prescription: true } }),
    
    // GI (A02)
    prisma.drug.create({ data: { nameRu: 'Омепразол', nameUz: 'Omeprazol', nameEn: 'Omeprazole', inn: 'Omeprazolum', atxCode: 'A02BC01', therapeuticGroup: 'PPIs', form: 'Capsules', dosage: '20mg', manufacturer: "Dr. Reddy's", country: 'India', barcode: '8600000000040', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Пантопразол', nameUz: 'Pantoprazol', nameEn: 'Pantoprazole', inn: 'Pantoprazolum', atxCode: 'A02BC02', therapeuticGroup: 'PPIs', form: 'Tablets', dosage: '40mg', manufacturer: 'Novartis', country: 'Switzerland', barcode: '8600000000041', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Фамотидин', nameUz: 'Famotidin', nameEn: 'Famotidine', inn: 'Famotidinum', atxCode: 'A02BA03', therapeuticGroup: 'H2 blockers', form: 'Tablets', dosage: '40mg', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000042', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Мезим Форте', nameUz: 'Mezim Forte', nameEn: 'Mezym Forte', inn: 'Pancreatinum', atxCode: 'A09AA02', therapeuticGroup: 'Digestive enzymes', form: 'Tablets', dosage: '10000 IU', manufacturer: 'Berlin-Chemie', country: 'Germany', barcode: '8600000000043', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Смекта', nameUz: 'Smekta', nameEn: 'Smecta', inn: 'Diosmectite', atxCode: 'A07BC05', therapeuticGroup: 'Antidiarrheals', form: 'Powder', dosage: '3g', manufacturer: 'Ipsen', country: 'France', barcode: '8600000000044', prescription: false } }),
    
    // Diabetes (A10)
    prisma.drug.create({ data: { nameRu: 'Метформин', nameUz: 'Metformin', nameEn: 'Metformin', inn: 'Metforminum', atxCode: 'A10BA02', therapeuticGroup: 'Antidiabetics', form: 'Tablets', dosage: '850mg', manufacturer: 'Merck', country: 'Germany', barcode: '8600000000050', prescription: true } }),
    prisma.drug.create({ data: { nameRu: 'Глибенкламид', nameUz: 'Glibenklamid', nameEn: 'Glibenclamide', inn: 'Glibenclamidum', atxCode: 'A10BB01', therapeuticGroup: 'Antidiabetics', form: 'Tablets', dosage: '5mg', manufacturer: 'Sanofi', country: 'France', barcode: '8600000000051', prescription: true } }),
    
    // Antihistamines (R06)
    prisma.drug.create({ data: { nameRu: 'Лоратадин', nameUz: 'Loratadin', nameEn: 'Loratadine', inn: 'Loratadinum', atxCode: 'R06AX13', therapeuticGroup: 'Antihistamines', form: 'Tablets', dosage: '10mg', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000060', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Цетиризин', nameUz: 'Setirizin', nameEn: 'Cetirizine', inn: 'Cetirizinum', atxCode: 'R06AE07', therapeuticGroup: 'Antihistamines', form: 'Tablets', dosage: '10mg', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000061', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Супрастин', nameUz: 'Suprastin', nameEn: 'Suprastin', inn: 'Chloropyramine', atxCode: 'R06AC03', therapeuticGroup: 'Antihistamines', form: 'Tablets', dosage: '25mg', manufacturer: 'Egis', country: 'Hungary', barcode: '8600000000062', prescription: false } }),
    
    // Respiratory (R05)
    prisma.drug.create({ data: { nameRu: 'Амброксол', nameUz: 'Ambroksol', nameEn: 'Ambroxol', inn: 'Ambroxolum', atxCode: 'R05CB06', therapeuticGroup: 'Mucolytics', form: 'Syrup', dosage: '30mg/5ml', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000070', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'АЦЦ', nameUz: 'ATS', nameEn: 'ACC', inn: 'Acetylcysteinum', atxCode: 'R05CB01', therapeuticGroup: 'Mucolytics', form: 'Powder', dosage: '200mg', manufacturer: 'Sandoz', country: 'Switzerland', barcode: '8600000000071', prescription: false } }),
    
    // Vitamins (A11)
    prisma.drug.create({ data: { nameRu: 'Витамин C', nameUz: 'C Vitamini', nameEn: 'Vitamin C', inn: 'Acidum ascorbicum', atxCode: 'A11GA01', therapeuticGroup: 'Vitamins', form: 'Tablets', dosage: '500mg', manufacturer: 'Uzpharma', country: 'Uzbekistan', barcode: '8600000000080', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Витамин D3', nameUz: 'D3 Vitamini', nameEn: 'Vitamin D3', inn: 'Colecalciferolum', atxCode: 'A11CC05', therapeuticGroup: 'Vitamins', form: 'Drops', dosage: '500 IU/drop', manufacturer: 'Teva', country: 'Israel', barcode: '8600000000081', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Компливит', nameUz: 'Komplivit', nameEn: 'Complivit', inn: 'Multivitamins', atxCode: 'A11AA03', therapeuticGroup: 'Vitamins', form: 'Tablets', dosage: '', manufacturer: 'Pharmstandard', country: 'Russia', barcode: '8600000000082', prescription: false } }),
    
    // Dermatology (D)
    prisma.drug.create({ data: { nameRu: 'Клотримазол крем', nameUz: 'Klotrimazol krem', nameEn: 'Clotrimazole cream', inn: 'Clotrimazolum', atxCode: 'D01AC01', therapeuticGroup: 'Antifungals', form: 'Cream', dosage: '1%', manufacturer: 'Bayer', country: 'Germany', barcode: '8600000000090', prescription: false } }),
    prisma.drug.create({ data: { nameRu: 'Гидрокортизон мазь', nameUz: 'Gidrokortizon malham', nameEn: 'Hydrocortisone ointment', inn: 'Hydrocortisonum', atxCode: 'D07AA02', therapeuticGroup: 'Corticosteroids', form: 'Ointment', dosage: '1%', manufacturer: 'Novartis', country: 'Switzerland', barcode: '8600000000091', prescription: true } }),
  ])

  // ========== Inventory ==========
  console.log('📦 Creating inventory...')
  const inventoryItems = []
  
  for (const pharmacy of pharmacies) {
    for (const drug of drugs) {
      // Random inventory for each drug in each pharmacy
      const hasStock = Math.random() > 0.15 // 85% chance of having stock
      if (hasStock) {
        const quantity = Math.floor(Math.random() * 500) + 10
        const minStock = Math.floor(Math.random() * 30) + 10
        const purchasePrice = Math.floor(Math.random() * 80000) + 5000
        const salePrice = Math.floor(purchasePrice * (1.25 + Math.random() * 0.5))
        
        // Random expiry date (6 months to 3 years from now)
        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 30) + 6)
        
        const batchNumber = `${drug.atxCode.substring(0, 3)}-2024-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
        
        inventoryItems.push(prisma.inventory.create({
          data: {
            drugId: drug.id,
            pharmacyId: pharmacy.id,
            supplierId: suppliers[Math.floor(Math.random() * suppliers.length)].id,
            quantity,
            minStock,
            purchasePriceUZS: purchasePrice,
            salePriceUZS: salePrice,
            purchasePriceUSD: Math.round(purchasePrice / 12850 * 100) / 100,
            salePriceUSD: Math.round(salePrice / 12850 * 100) / 100,
            batchNumber,
            expiryDate,
          }
        }))
      }
    }
  }
  
  const inventory = await Promise.all(inventoryItems)
  console.log(`   Created ${inventory.length} inventory items`)

  // ========== Transactions ==========
  console.log('💰 Creating transactions...')
  const transactions = []
  const now = new Date()
  
  for (let i = 0; i < 200; i++) {
    const type = ['SALE', 'PURCHASE', 'SALE', 'SALE', 'RETURN'][Math.floor(Math.random() * 5)]
    const drug = drugs[Math.floor(Math.random() * drugs.length)]
    const pharmacy = pharmacies[Math.floor(Math.random() * pharmacies.length)]
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)]
    const quantity = Math.floor(Math.random() * 50) + 1
    const unitPrice = Math.floor(Math.random() * 80000) + 5000
    
    // Random date in last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60))
    
    const invoicePrefix = type === 'SALE' ? 'INV' : type === 'PURCHASE' ? 'PO' : 'RET'
    const invoiceNumber = `${invoicePrefix}-${String(100000 + i).padStart(6, '0')}`
    
    transactions.push(prisma.transaction.create({
      data: {
        type: type as 'SALE' | 'PURCHASE' | 'TRANSFER' | 'RETURN',
        drugId: drug.id,
        pharmacyId: pharmacy.id,
        supplierId: type === 'PURCHASE' ? supplier.id : null,
        quantity,
        unitPriceUZS: unitPrice,
        totalAmountUZS: unitPrice * quantity * (type === 'RETURN' ? -1 : 1),
        currency: 'UZS',
        invoiceNumber,
        createdAt: date,
      }
    }))
  }
  
  await Promise.all(transactions)
  console.log(`   Created ${transactions.length} transactions`)

  // ========== Settings ==========
  console.log('⚙️ Creating settings...')
  await Promise.all([
    prisma.settings.create({ data: { key: 'organization_name', value: 'PharmaCentral' } }),
    prisma.settings.create({ data: { key: 'language', value: 'ru' } }),
    prisma.settings.create({ data: { key: 'currency', value: 'UZS' } }),
    prisma.settings.create({ data: { key: 'usd_rate', value: '12850' } }),
    prisma.settings.create({ data: { key: 'low_stock_threshold', value: '20' } }),
    prisma.settings.create({ data: { key: 'expiry_alert_days', value: '90' } }),
  ])

  console.log('✅ Seeding completed successfully!')
  console.log(`
    Summary:
    - ${atxCategories.length} ATX categories
    - ${suppliers.length} suppliers
    - ${pharmacies.length} pharmacies
    - ${drugs.length} drugs
    - ${inventory.length} inventory items
    - ${transactions.length} transactions
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
