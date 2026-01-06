-- SignPharm Sample Data
-- Run this in Supabase Dashboard → SQL Editor

-- Insert Pharmacies
INSERT INTO "Pharmacy" (id, name, region, district, address, phone, email, manager, "isActive") VALUES
('pharm-001', 'Аптека №1', 'Ташкент', 'Чиланзарский район', 'ул. Катартал, 28', '+998 71 123-45-67', 'apteka1@pharma.uz', 'Иванова А.С.', true),
('pharm-002', 'Аптека №2', 'Ташкент', 'Юнусабадский район', 'ул. Амира Темура, 108', '+998 71 234-56-78', 'apteka2@pharma.uz', 'Петров И.В.', true),
('pharm-003', 'Аптека №3', 'Самарканд', 'Самаркандский район', 'пр. Регистан, 12', '+998 66 123-45-67', 'apteka3@pharma.uz', 'Алиев Р.Ш.', true);

-- Insert Suppliers
INSERT INTO "Supplier" (id, name, "nameRu", country, type, contact, phone, email, "isActive") VALUES
('supp-001', 'Uzpharma', 'Узфарма', 'Uzbekistan', 'MANUFACTURER', 'Алиев Рустам', '+998 71 256-78-90', 'info@uzpharma.uz', true),
('supp-002', 'Nobel Pharma', 'Нобель Фарма', 'Turkey', 'DISTRIBUTOR', 'Мехмет Йылмаз', '+90 212 555-12-34', 'info@nobelpharma.com', true),
('supp-003', 'Sandoz', 'Сандоз', 'Switzerland', 'MANUFACTURER', 'Ханс Мюллер', '+41 61 324-25-26', 'orders@sandoz.com', true);

-- Insert Drugs
INSERT INTO "Drug" (id, name, "nameRu", "nameUz", inn, "atxCode", "therapeuticGroup", form, dosage, manufacturer, country, prescription) VALUES
('drug-001', 'Paracetamol', 'Парацетамол', 'Paratsetamol', 'Paracetamolum', 'N02BE01', 'Анальгетики', 'Tablets', '500mg', 'Uzpharma', 'Uzbekistan', false),
('drug-002', 'Ibuprofen', 'Ибупрофен', 'Ibuprofen', 'Ibuprofenum', 'M01AE01', 'НПВС', 'Tablets', '400mg', 'Sandoz', 'Switzerland', false),
('drug-003', 'Amoxicillin', 'Амоксициллин', 'Amoksitsillin', 'Amoxicillinum', 'J01CA04', 'Антибиотики', 'Capsules', '500mg', 'Nobel Pharma', 'Turkey', true),
('drug-004', 'Omeprazole', 'Омепразол', 'Omeprazol', 'Omeprazolum', 'A02BC01', 'ИПП', 'Capsules', '20mg', 'Sandoz', 'Switzerland', false),
('drug-005', 'Aspirin', 'Аспирин', 'Aspirin', 'Acidum acetylsalicylicum', 'N02BA01', 'Анальгетики', 'Tablets', '100mg', 'Uzpharma', 'Uzbekistan', false),
('drug-006', 'Metformin', 'Метформин', 'Metformin', 'Metforminum', 'A10BA02', 'Антидиабетические', 'Tablets', '850mg', 'Nobel Pharma', 'Turkey', true),
('drug-007', 'Diclofenac', 'Диклофенак', 'Diklofenak', 'Diclofenacum', 'M01AB05', 'НПВС', 'Gel', '1%', 'Uzpharma', 'Uzbekistan', false),
('drug-008', 'Loratadine', 'Лоратадин', 'Loratadin', 'Loratadinum', 'R06AX13', 'Антигистаминные', 'Tablets', '10mg', 'Sandoz', 'Switzerland', false);

-- Insert Inventory
INSERT INTO "Inventory" (id, "drugId", "pharmacyId", "supplierId", quantity, "purchasePriceUZS", "salePriceUZS", "batchNumber", "expiryDate", "minStock") VALUES
('inv-001', 'drug-001', 'pharm-001', 'supp-001', 150, 8000, 12000, 'BATCH-2024-001', '2026-06-15', 20),
('inv-002', 'drug-002', 'pharm-001', 'supp-003', 80, 15000, 22000, 'BATCH-2024-002', '2026-09-20', 15),
('inv-003', 'drug-003', 'pharm-001', 'supp-002', 45, 25000, 35000, 'BATCH-2024-003', '2025-12-10', 10),
('inv-004', 'drug-004', 'pharm-001', 'supp-003', 60, 18000, 28000, 'BATCH-2024-004', '2026-03-25', 15),
('inv-005', 'drug-005', 'pharm-001', 'supp-001', 200, 5000, 8000, 'BATCH-2024-005', '2027-01-01', 30),
('inv-006', 'drug-006', 'pharm-002', 'supp-002', 35, 22000, 32000, 'BATCH-2024-006', '2026-08-15', 10),
('inv-007', 'drug-007', 'pharm-002', 'supp-001', 90, 12000, 18000, 'BATCH-2024-007', '2026-05-20', 20),
('inv-008', 'drug-008', 'pharm-002', 'supp-003', 120, 10000, 15000, 'BATCH-2024-008', '2026-11-30', 25),
('inv-009', 'drug-001', 'pharm-002', 'supp-001', 100, 8000, 12000, 'BATCH-2024-009', '2026-07-01', 20),
('inv-010', 'drug-002', 'pharm-003', 'supp-003', 55, 15000, 22000, 'BATCH-2024-010', '2026-04-10', 15),
('inv-011', 'drug-003', 'pharm-003', 'supp-002', 8, 25000, 35000, 'BATCH-2024-011', '2025-02-28', 10),
('inv-012', 'drug-005', 'pharm-003', 'supp-001', 180, 5000, 8000, 'BATCH-2024-012', '2026-12-15', 30);

-- Insert Transactions (Sales and Purchases)
INSERT INTO "Transaction" (id, type, "drugId", "pharmacyId", "supplierId", quantity, "unitPriceUZS", "totalAmountUZS", "batchNumber", "invoiceNumber", "createdAt") VALUES
('tx-001', 'PURCHASE', 'drug-001', 'pharm-001', 'supp-001', 200, 8000, 1600000, 'BATCH-2024-001', 'PO-2024-001', NOW() - INTERVAL '7 days'),
('tx-002', 'PURCHASE', 'drug-002', 'pharm-001', 'supp-003', 100, 15000, 1500000, 'BATCH-2024-002', 'PO-2024-002', NOW() - INTERVAL '6 days'),
('tx-003', 'SALE', 'drug-001', 'pharm-001', NULL, 5, 12000, 60000, 'BATCH-2024-001', 'INV-2024-001', NOW() - INTERVAL '5 days'),
('tx-004', 'SALE', 'drug-002', 'pharm-001', NULL, 3, 22000, 66000, 'BATCH-2024-002', 'INV-2024-002', NOW() - INTERVAL '4 days'),
('tx-005', 'SALE', 'drug-001', 'pharm-001', NULL, 10, 12000, 120000, 'BATCH-2024-001', 'INV-2024-003', NOW() - INTERVAL '3 days'),
('tx-006', 'PURCHASE', 'drug-003', 'pharm-001', 'supp-002', 50, 25000, 1250000, 'BATCH-2024-003', 'PO-2024-003', NOW() - INTERVAL '3 days'),
('tx-007', 'SALE', 'drug-003', 'pharm-001', NULL, 2, 35000, 70000, 'BATCH-2024-003', 'INV-2024-004', NOW() - INTERVAL '2 days'),
('tx-008', 'SALE', 'drug-005', 'pharm-001', NULL, 15, 8000, 120000, 'BATCH-2024-005', 'INV-2024-005', NOW() - INTERVAL '1 day'),
('tx-009', 'SALE', 'drug-008', 'pharm-002', NULL, 8, 15000, 120000, 'BATCH-2024-008', 'INV-2024-006', NOW() - INTERVAL '1 day'),
('tx-010', 'SALE', 'drug-001', 'pharm-002', NULL, 12, 12000, 144000, 'BATCH-2024-009', 'INV-2024-007', NOW()),
('tx-011', 'SALE', 'drug-002', 'pharm-003', NULL, 5, 22000, 110000, 'BATCH-2024-010', 'INV-2024-008', NOW()),
('tx-012', 'SALE', 'drug-005', 'pharm-003', NULL, 20, 8000, 160000, 'BATCH-2024-012', 'INV-2024-009', NOW());

-- Verify data
SELECT 'Pharmacies:', COUNT(*) FROM "Pharmacy"
UNION ALL SELECT 'Suppliers:', COUNT(*) FROM "Supplier"
UNION ALL SELECT 'Drugs:', COUNT(*) FROM "Drug"
UNION ALL SELECT 'Inventory:', COUNT(*) FROM "Inventory"
UNION ALL SELECT 'Transactions:', COUNT(*) FROM "Transaction";
