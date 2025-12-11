export type Language = 'ru' | 'uz' | 'en'

export const translations = {
  ru: {
    // Navigation
    dashboard: 'Панель управления',
    drugs: 'Препараты',
    inventory: 'Склад',
    pharmacies: 'Аптеки',
    suppliers: 'Поставщики',
    sales: 'Продажи',
    analytics: 'Аналитика',
    settings: 'Настройки',
    
    // Dashboard
    totalDrugs: 'Всего препаратов',
    totalInventory: 'Стоимость склада',
    todaySales: 'Продажи сегодня',
    lowStock: 'Мало на складе',
    recentTransactions: 'Последние операции',
    topSellingDrugs: 'Топ продаж',
    inventoryByPharmacy: 'Склад по аптекам',
    expiringItems: 'Истекает срок',
    
    // Common
    add: 'Добавить',
    edit: 'Редактировать',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    search: 'Поиск',
    filter: 'Фильтр',
    export: 'Экспорт',
    import: 'Импорт',
    actions: 'Действия',
    status: 'Статус',
    active: 'Активный',
    inactive: 'Неактивный',
    all: 'Все',
    name: 'Название',
    quantity: 'Количество',
    price: 'Цена',
    date: 'Дата',
    region: 'Регион',
    
    // Drugs
    drugName: 'Наименование препарата',
    inn: 'МНН',
    atxCode: 'Код АТХ',
    therapeuticGroup: 'Терапевтическая группа',
    form: 'Форма выпуска',
    dosage: 'Дозировка',
    manufacturer: 'Производитель',
    prescription: 'Рецептурный',
    barcode: 'Штрих-код',
    
    // Inventory
    purchasePrice: 'Цена закупки',
    salePrice: 'Цена продажи',
    batchNumber: 'Номер партии',
    expiryDate: 'Срок годности',
    minStock: 'Мин. запас',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    
    // Transactions
    sale: 'Продажа',
    purchase: 'Закупка',
    transfer: 'Перемещение',
    return: 'Возврат',
    totalAmount: 'Сумма',
    unitPrice: 'Цена за ед.',
    
    // Suppliers
    supplierName: 'Наименование поставщика',
    supplierType: 'Тип',
    distributorType: 'Дистрибьютор',
    manufacturerType: 'Производитель',
    importerType: 'Импортер',
    country: 'Страна',
    contact: 'Контакт',
    
    // Analytics
    salesAnalytics: 'Аналитика продаж',
    inventoryTurnover: 'Оборачиваемость',
    revenueByPeriod: 'Выручка по периодам',
    profitMargin: 'Маржинальность',
    
    // Alerts
    lowStockAlert: 'Мало товара на складе',
    expiryAlert: 'Истекает срок годности',
    criticalStock: 'Критический запас',
  },
  
  uz: {
    // Navigation
    dashboard: 'Boshqaruv paneli',
    drugs: 'Dorilar',
    inventory: 'Ombor',
    pharmacies: 'Dorixonalar',
    suppliers: 'Yetkazib beruvchilar',
    sales: 'Sotuvlar',
    analytics: 'Tahlil',
    settings: 'Sozlamalar',
    
    // Dashboard
    totalDrugs: 'Jami dorilar',
    totalInventory: 'Ombor qiymati',
    todaySales: 'Bugungi sotuvlar',
    lowStock: 'Kam qolgan',
    recentTransactions: 'Oxirgi operatsiyalar',
    topSellingDrugs: 'Eng ko\'p sotilgan',
    inventoryByPharmacy: 'Dorixona bo\'yicha ombor',
    expiringItems: 'Muddati tugayotgan',
    
    // Common
    add: 'Qo\'shish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    search: 'Qidirish',
    filter: 'Filtr',
    export: 'Eksport',
    import: 'Import',
    actions: 'Amallar',
    status: 'Holat',
    active: 'Faol',
    inactive: 'Nofaol',
    all: 'Barchasi',
    name: 'Nomi',
    quantity: 'Miqdor',
    price: 'Narx',
    date: 'Sana',
    region: 'Viloyat',
    
    // Drugs
    drugName: 'Dori nomi',
    inn: 'XNN',
    atxCode: 'ATX kodi',
    therapeuticGroup: 'Terapevtik guruh',
    form: 'Shakli',
    dosage: 'Dozasi',
    manufacturer: 'Ishlab chiqaruvchi',
    prescription: 'Retseptli',
    barcode: 'Shtrix-kod',
    
    // Inventory
    purchasePrice: 'Sotib olish narxi',
    salePrice: 'Sotish narxi',
    batchNumber: 'Partiya raqami',
    expiryDate: 'Yaroqlilik muddati',
    minStock: 'Min. zaxira',
    inStock: 'Mavjud',
    outOfStock: 'Mavjud emas',
    
    // Transactions
    sale: 'Sotish',
    purchase: 'Sotib olish',
    transfer: 'Ko\'chirish',
    return: 'Qaytarish',
    totalAmount: 'Jami summa',
    unitPrice: 'Birlik narxi',
    
    // Suppliers
    supplierName: 'Yetkazib beruvchi nomi',
    supplierType: 'Turi',
    distributorType: 'Distribyutor',
    manufacturerType: 'Ishlab chiqaruvchi',
    importerType: 'Import qiluvchi',
    country: 'Davlat',
    contact: 'Aloqa',
    
    // Analytics
    salesAnalytics: 'Sotuvlar tahlili',
    inventoryTurnover: 'Aylanish',
    revenueByPeriod: 'Davrlar bo\'yicha daromad',
    profitMargin: 'Daromadlilik',
    
    // Alerts
    lowStockAlert: 'Zaxira kam qoldi',
    expiryAlert: 'Yaroqlilik muddati tugamoqda',
    criticalStock: 'Kritik zaxira',
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    drugs: 'Drugs',
    inventory: 'Inventory',
    pharmacies: 'Pharmacies',
    suppliers: 'Suppliers',
    sales: 'Sales',
    analytics: 'Analytics',
    settings: 'Settings',
    
    // Dashboard
    totalDrugs: 'Total Drugs',
    totalInventory: 'Inventory Value',
    todaySales: "Today's Sales",
    lowStock: 'Low Stock',
    recentTransactions: 'Recent Transactions',
    topSellingDrugs: 'Top Selling Drugs',
    inventoryByPharmacy: 'Inventory by Pharmacy',
    expiringItems: 'Expiring Soon',
    
    // Common
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    all: 'All',
    name: 'Name',
    quantity: 'Quantity',
    price: 'Price',
    date: 'Date',
    region: 'Region',
    
    // Drugs
    drugName: 'Drug Name',
    inn: 'INN',
    atxCode: 'ATX Code',
    therapeuticGroup: 'Therapeutic Group',
    form: 'Form',
    dosage: 'Dosage',
    manufacturer: 'Manufacturer',
    prescription: 'Prescription',
    barcode: 'Barcode',
    
    // Inventory
    purchasePrice: 'Purchase Price',
    salePrice: 'Sale Price',
    batchNumber: 'Batch Number',
    expiryDate: 'Expiry Date',
    minStock: 'Min. Stock',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    
    // Transactions
    sale: 'Sale',
    purchase: 'Purchase',
    transfer: 'Transfer',
    return: 'Return',
    totalAmount: 'Total Amount',
    unitPrice: 'Unit Price',
    
    // Suppliers
    supplierName: 'Supplier Name',
    supplierType: 'Type',
    distributorType: 'Distributor',
    manufacturerType: 'Manufacturer',
    importerType: 'Importer',
    country: 'Country',
    contact: 'Contact',
    
    // Analytics
    salesAnalytics: 'Sales Analytics',
    inventoryTurnover: 'Inventory Turnover',
    revenueByPeriod: 'Revenue by Period',
    profitMargin: 'Profit Margin',
    
    // Alerts
    lowStockAlert: 'Low Stock Alert',
    expiryAlert: 'Expiry Alert',
    criticalStock: 'Critical Stock',
  }
}

export type TranslationKey = keyof typeof translations.ru

export function useTranslation(lang: Language = 'ru') {
  return {
    t: (key: TranslationKey) => translations[lang][key] || key,
    lang,
  }
}
