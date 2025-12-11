'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Eye,
  X,
} from 'lucide-react'

// Sample drugs data with translations - comprehensive 30+ drug catalog
const drugsData = [
  // Analgesics
  { id: '1', name: { ru: 'Парацетамол', uz: 'Paratsetamol', en: 'Paracetamol' }, inn: 'Paracetamolum', atxCode: 'N02BE01', therapeuticGroup: { ru: 'Анальгетики', uz: 'Analgeziklar', en: 'Analgesics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '500mg', manufacturer: 'Uzpharma', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, prescription: false },
  { id: '2', name: { ru: 'Парацетамол Детский', uz: 'Paratsetamol Bolalar uchun', en: 'Paracetamol Pediatric' }, inn: 'Paracetamolum', atxCode: 'N02BE01', therapeuticGroup: { ru: 'Анальгетики', uz: 'Analgeziklar', en: 'Analgesics' }, form: { ru: 'Сироп', uz: 'Sirop', en: 'Syrup' }, dosage: '120mg/5ml', manufacturer: 'Uzpharma', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, prescription: false },
  { id: '3', name: { ru: 'Анальгин', uz: 'Analgin', en: 'Analgin' }, inn: 'Metamizolum natricum', atxCode: 'N02BB02', therapeuticGroup: { ru: 'Анальгетики', uz: 'Analgeziklar', en: 'Analgesics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '500mg', manufacturer: 'Biokom', country: { ru: 'Россия', uz: 'Rossiya', en: 'Russia' }, prescription: false },
  { id: '4', name: { ru: 'Кетанов', uz: 'Ketanov', en: 'Ketanov' }, inn: 'Ketorolacum', atxCode: 'M01AB15', therapeuticGroup: { ru: 'Анальгетики', uz: 'Analgeziklar', en: 'Analgesics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '10mg', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: true },
  
  // NSAIDs
  { id: '5', name: { ru: 'Ибупрофен', uz: 'Ibuprofen', en: 'Ibuprofen' }, inn: 'Ibuprofenum', atxCode: 'M01AE01', therapeuticGroup: { ru: 'НПВС', uz: 'NSAID', en: 'NSAIDs' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '400mg', manufacturer: 'Nobel Pharma', country: { ru: 'Турция', uz: 'Turkiya', en: 'Turkey' }, prescription: false },
  { id: '6', name: { ru: 'Диклофенак', uz: 'Diklofenak', en: 'Diclofenac' }, inn: 'Diclofenacum', atxCode: 'M01AB05', therapeuticGroup: { ru: 'НПВС', uz: 'NSAID', en: 'NSAIDs' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '50mg', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '7', name: { ru: 'Диклофенак Гель', uz: 'Diklofenak Gel', en: 'Diclofenac Gel' }, inn: 'Diclofenacum', atxCode: 'M02AA15', therapeuticGroup: { ru: 'НПВС', uz: 'NSAID', en: 'NSAIDs' }, form: { ru: 'Гель', uz: 'Gel', en: 'Gel' }, dosage: '1%', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: false },
  { id: '8', name: { ru: 'Нимесулид', uz: 'Nimesulid', en: 'Nimesulide' }, inn: 'Nimesulidum', atxCode: 'M01AX17', therapeuticGroup: { ru: 'НПВС', uz: 'NSAID', en: 'NSAIDs' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '100mg', manufacturer: "Dr. Reddy's", country: { ru: 'Индия', uz: 'Hindiston', en: 'India' }, prescription: true },
  
  // Antibiotics
  { id: '9', name: { ru: 'Амоксициллин', uz: 'Amoksitsillin', en: 'Amoxicillin' }, inn: 'Amoxicillinum', atxCode: 'J01CA04', therapeuticGroup: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, form: { ru: 'Капсулы', uz: 'Kapsulalar', en: 'Capsules' }, dosage: '500mg', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '10', name: { ru: 'Амоксиклав', uz: 'Amoksiklav', en: 'Amoxiclav' }, inn: 'Amoxicillinum + Acidum clavulanicum', atxCode: 'J01CR02', therapeuticGroup: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '625mg', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '11', name: { ru: 'Цефтриаксон', uz: 'Seftriakson', en: 'Ceftriaxone' }, inn: 'Ceftriaxonum', atxCode: 'J01DD04', therapeuticGroup: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, form: { ru: 'Порошок', uz: 'Kukun', en: 'Powder' }, dosage: '1g', manufacturer: 'Biokom', country: { ru: 'Россия', uz: 'Rossiya', en: 'Russia' }, prescription: true },
  { id: '12', name: { ru: 'Азитромицин', uz: 'Azitromitsin', en: 'Azithromycin' }, inn: 'Azithromycinum', atxCode: 'J01FA10', therapeuticGroup: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '500mg', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: true },
  { id: '13', name: { ru: 'Ципрофлоксацин', uz: 'Siprofloksatsin', en: 'Ciprofloxacin' }, inn: 'Ciprofloxacinum', atxCode: 'J01MA02', therapeuticGroup: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '500mg', manufacturer: 'Bayer', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, prescription: true },
  
  // Cardiovascular
  { id: '14', name: { ru: 'Аспирин Кардио', uz: 'Aspirin Kardio', en: 'Aspirin Cardio' }, inn: 'Acidum acetylsalicylicum', atxCode: 'B01AC06', therapeuticGroup: { ru: 'Антиагреганты', uz: 'Antiagregantlar', en: 'Antiplatelets' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '100mg', manufacturer: 'Bayer', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, prescription: false },
  { id: '15', name: { ru: 'Амлодипин', uz: 'Amlodipin', en: 'Amlodipine' }, inn: 'Amlodipinum', atxCode: 'C08CA01', therapeuticGroup: { ru: 'Антигипертензивные', uz: 'Gipertoniyaga qarshi', en: 'Antihypertensives' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '5mg', manufacturer: 'Novartis', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '16', name: { ru: 'Лизиноприл', uz: 'Lizinopril', en: 'Lisinopril' }, inn: 'Lisinoprilum', atxCode: 'C09AA03', therapeuticGroup: { ru: 'Антигипертензивные', uz: 'Gipertoniyaga qarshi', en: 'Antihypertensives' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '10mg', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: true },
  { id: '17', name: { ru: 'Эналаприл', uz: 'Enalapril', en: 'Enalapril' }, inn: 'Enalaprilum', atxCode: 'C09AA02', therapeuticGroup: { ru: 'Антигипертензивные', uz: 'Gipertoniyaga qarshi', en: 'Antihypertensives' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '20mg', manufacturer: "Dr. Reddy's", country: { ru: 'Индия', uz: 'Hindiston', en: 'India' }, prescription: true },
  { id: '18', name: { ru: 'Бисопролол', uz: 'Bisoprolol', en: 'Bisoprolol' }, inn: 'Bisoprololum', atxCode: 'C07AB07', therapeuticGroup: { ru: 'Бета-блокаторы', uz: 'Beta-blokatorlar', en: 'Beta blockers' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '5mg', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '19', name: { ru: 'Аторвастатин', uz: 'Atorvastatin', en: 'Atorvastatin' }, inn: 'Atorvastatinum', atxCode: 'C10AA05', therapeuticGroup: { ru: 'Статины', uz: 'Statinlar', en: 'Statins' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '20mg', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: true },
  
  // GI
  { id: '20', name: { ru: 'Омепразол', uz: 'Omeprazol', en: 'Omeprazole' }, inn: 'Omeprazolum', atxCode: 'A02BC01', therapeuticGroup: { ru: 'ИПП', uz: 'PPI', en: 'PPIs' }, form: { ru: 'Капсулы', uz: 'Kapsulalar', en: 'Capsules' }, dosage: '20mg', manufacturer: "Dr. Reddy's", country: { ru: 'Индия', uz: 'Hindiston', en: 'India' }, prescription: true },
  { id: '21', name: { ru: 'Пантопразол', uz: 'Pantoprazol', en: 'Pantoprazole' }, inn: 'Pantoprazolum', atxCode: 'A02BC02', therapeuticGroup: { ru: 'ИПП', uz: 'PPI', en: 'PPIs' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '40mg', manufacturer: 'Novartis', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
  { id: '22', name: { ru: 'Мезим Форте', uz: 'Mezim Forte', en: 'Mezym Forte' }, inn: 'Pancreatinum', atxCode: 'A09AA02', therapeuticGroup: { ru: 'Ферменты', uz: 'Fermentlar', en: 'Digestive enzymes' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '10000 IU', manufacturer: 'Berlin-Chemie', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, prescription: false },
  { id: '23', name: { ru: 'Смекта', uz: 'Smekta', en: 'Smecta' }, inn: 'Diosmectite', atxCode: 'A07BC05', therapeuticGroup: { ru: 'Антидиарейные', uz: 'Diareya davorsi', en: 'Antidiarrheals' }, form: { ru: 'Порошок', uz: 'Kukun', en: 'Powder' }, dosage: '3g', manufacturer: 'Ipsen', country: { ru: 'Франция', uz: 'Fransiya', en: 'France' }, prescription: false },
  
  // Diabetes
  { id: '24', name: { ru: 'Метформин', uz: 'Metformin', en: 'Metformin' }, inn: 'Metforminum', atxCode: 'A10BA02', therapeuticGroup: { ru: 'Противодиабетические', uz: 'Qandli diabetga qarshi', en: 'Antidiabetics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '850mg', manufacturer: 'Merck', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, prescription: true },
  { id: '25', name: { ru: 'Глибенкламид', uz: 'Glibenklamid', en: 'Glibenclamide' }, inn: 'Glibenclamidum', atxCode: 'A10BB01', therapeuticGroup: { ru: 'Противодиабетические', uz: 'Qandli diabetga qarshi', en: 'Antidiabetics' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '5mg', manufacturer: 'Sanofi', country: { ru: 'Франция', uz: 'Fransiya', en: 'France' }, prescription: true },
  
  // Antihistamines
  { id: '26', name: { ru: 'Лоратадин', uz: 'Loratadin', en: 'Loratadine' }, inn: 'Loratadinum', atxCode: 'R06AX13', therapeuticGroup: { ru: 'Антигистаминные', uz: 'Antihistaminlar', en: 'Antihistamines' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '10mg', manufacturer: 'Uzpharma', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, prescription: false },
  { id: '27', name: { ru: 'Цетиризин', uz: 'Setirizin', en: 'Cetirizine' }, inn: 'Cetirizinum', atxCode: 'R06AE07', therapeuticGroup: { ru: 'Антигистаминные', uz: 'Antihistaminlar', en: 'Antihistamines' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '10mg', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: false },
  { id: '28', name: { ru: 'Супрастин', uz: 'Suprastin', en: 'Suprastin' }, inn: 'Chloropyramine', atxCode: 'R06AC03', therapeuticGroup: { ru: 'Антигистаминные', uz: 'Antihistaminlar', en: 'Antihistamines' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '25mg', manufacturer: 'Egis', country: { ru: 'Венгрия', uz: 'Vengriya', en: 'Hungary' }, prescription: false },
  
  // Respiratory
  { id: '29', name: { ru: 'Амброксол', uz: 'Ambroksol', en: 'Ambroxol' }, inn: 'Ambroxolum', atxCode: 'R05CB06', therapeuticGroup: { ru: 'Муколитики', uz: 'Mukolitiklar', en: 'Mucolytics' }, form: { ru: 'Сироп', uz: 'Sirop', en: 'Syrup' }, dosage: '30mg/5ml', manufacturer: 'Uzpharma', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, prescription: false },
  { id: '30', name: { ru: 'АЦЦ', uz: 'ATS', en: 'ACC' }, inn: 'Acetylcysteinum', atxCode: 'R05CB01', therapeuticGroup: { ru: 'Муколитики', uz: 'Mukolitiklar', en: 'Mucolytics' }, form: { ru: 'Порошок', uz: 'Kukun', en: 'Powder' }, dosage: '200mg', manufacturer: 'Sandoz', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: false },
  
  // Vitamins
  { id: '31', name: { ru: 'Витамин C', uz: 'C Vitamini', en: 'Vitamin C' }, inn: 'Acidum ascorbicum', atxCode: 'A11GA01', therapeuticGroup: { ru: 'Витамины', uz: 'Vitaminlar', en: 'Vitamins' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '500mg', manufacturer: 'Uzpharma', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, prescription: false },
  { id: '32', name: { ru: 'Витамин D3', uz: 'D3 Vitamini', en: 'Vitamin D3' }, inn: 'Colecalciferolum', atxCode: 'A11CC05', therapeuticGroup: { ru: 'Витамины', uz: 'Vitaminlar', en: 'Vitamins' }, form: { ru: 'Капли', uz: 'Tomchilar', en: 'Drops' }, dosage: '500 IU/drop', manufacturer: 'Teva', country: { ru: 'Израиль', uz: 'Isroil', en: 'Israel' }, prescription: false },
  { id: '33', name: { ru: 'Компливит', uz: 'Komplivit', en: 'Complivit' }, inn: 'Multivitamins', atxCode: 'A11AA03', therapeuticGroup: { ru: 'Витамины', uz: 'Vitaminlar', en: 'Vitamins' }, form: { ru: 'Таблетки', uz: 'Tabletkalar', en: 'Tablets' }, dosage: '', manufacturer: 'Pharmstandard', country: { ru: 'Россия', uz: 'Rossiya', en: 'Russia' }, prescription: false },
  
  // Dermatology
  { id: '34', name: { ru: 'Клотримазол крем', uz: 'Klotrimazol krem', en: 'Clotrimazole cream' }, inn: 'Clotrimazolum', atxCode: 'D01AC01', therapeuticGroup: { ru: 'Противогрибковые', uz: "Zamburug'larga qarshi", en: 'Antifungals' }, form: { ru: 'Крем', uz: 'Krem', en: 'Cream' }, dosage: '1%', manufacturer: 'Bayer', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, prescription: false },
  { id: '35', name: { ru: 'Гидрокортизон мазь', uz: 'Gidrokortizon malham', en: 'Hydrocortisone ointment' }, inn: 'Hydrocortisonum', atxCode: 'D07AA02', therapeuticGroup: { ru: 'Кортикостероиды', uz: 'Kortikosteroidlar', en: 'Corticosteroids' }, form: { ru: 'Мазь', uz: 'Malham', en: 'Ointment' }, dosage: '1%', manufacturer: 'Novartis', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, prescription: true },
]

const atxGroups = [
  { code: 'A', name: { ru: 'Пищеварительный тракт и обмен веществ', uz: "Ovqat hazm qilish va moddalar almashinuvi", en: 'Alimentary tract and metabolism' } },
  { code: 'B', name: { ru: 'Кровь и система кроветворения', uz: 'Qon va qon hosil qilish tizimi', en: 'Blood and blood forming organs' } },
  { code: 'C', name: { ru: 'Сердечно-сосудистая система', uz: 'Yurak-qon tomir tizimi', en: 'Cardiovascular system' } },
  { code: 'J', name: { ru: 'Противомикробные препараты', uz: 'Antimikrob preparatlar', en: 'Antiinfectives' } },
  { code: 'M', name: { ru: 'Костно-мышечная система', uz: "Suyak-mushak tizimi", en: 'Musculoskeletal system' } },
  { code: 'N', name: { ru: 'Нервная система', uz: 'Nerv tizimi', en: 'Nervous system' } },
  { code: 'R', name: { ru: 'Респираторная система', uz: 'Nafas olish tizimi', en: 'Respiratory system' } },
]

export default function DrugsPage() {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<typeof drugsData[0] | null>(null)

  const therapeuticGroups = [t('allGroups'), ...new Set(drugsData.map(d => d.therapeuticGroup[lang]))]
  
  const filteredDrugs = drugsData.filter(drug => {
    const matchesSearch = drug.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drug.inn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drug.atxCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = !selectedGroup || selectedGroup === t('allGroups') || drug.therapeuticGroup[lang] === selectedGroup
    return matchesSearch && matchesGroup
  })

  return (
    <>
      <Header 
        title={t('drugs')} 
        subtitle={t('drugCatalog')}
      />
      
      <div className="page-content">
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="search-input" style={{ width: '300px' }}>
              <Search className="search-input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder={t('searchDrugs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            
            <select 
              className="form-input form-select"
              style={{ width: '220px' }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {therapeuticGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <button 
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              {t('filters')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary">
              <Download size={16} />
              {t('export')}
            </button>
            <button className="btn btn-secondary">
              <Upload size={16} />
              {t('import')}
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              {t('addDrug')}
            </button>
          </div>
        </div>

        {/* ATX Filter Panel */}
        {showFilters && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('atxClassification')}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {atxGroups.map(group => (
                  <button 
                    key={group.code}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                  >
                    <span style={{ 
                      background: 'var(--primary)', 
                      color: 'white', 
                      padding: '0.125rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {group.code}
                    </span>
                    {group.name[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('found')}: <strong style={{ color: 'var(--text-primary)' }}>{filteredDrugs.length}</strong> {lang === 'ru' ? 'препаратов' : lang === 'uz' ? 'dori' : 'drugs'}
        </div>

        {/* Drugs Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('inn')}</th>
                  <th>{t('atxCode')}</th>
                  <th>{t('therapeuticGroup')}</th>
                  <th>{t('form')}</th>
                  <th>{t('dosage')}</th>
                  <th>{t('manufacturer')}</th>
                  <th>Rx</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrugs.map(drug => (
                  <tr key={drug.id}>
                    <td style={{ fontWeight: 600 }}>{drug.name[lang]}</td>
                    <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{drug.inn}</td>
                    <td><span className="badge badge-primary">{drug.atxCode}</span></td>
                    <td>{drug.therapeuticGroup[lang]}</td>
                    <td>{drug.form[lang]}</td>
                    <td>{drug.dosage}</td>
                    <td>
                      <div>
                        <div>{drug.manufacturer}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{drug.country[lang]}</div>
                      </div>
                    </td>
                    <td>
                      {drug.prescription ? (
                        <span className="badge badge-warning">Rx</span>
                      ) : (
                        <span className="badge badge-success">OTC</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-icon btn-ghost" onClick={() => setSelectedDrug(drug)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-icon btn-ghost">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drug Detail Modal */}
        {selectedDrug && (
          <div className="modal-overlay" onClick={() => setSelectedDrug(null)}>
            <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{selectedDrug.name[lang]}</h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setSelectedDrug(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">{t('tradeName')}</label>
                    <div style={{ fontWeight: 500 }}>{selectedDrug.name[lang]}</div>
                  </div>
                  <div>
                    <label className="form-label">{t('inn')}</label>
                    <div style={{ fontStyle: 'italic' }}>{selectedDrug.inn}</div>
                  </div>
                  <div>
                    <label className="form-label">{t('atxCode')}</label>
                    <div><span className="badge badge-primary">{selectedDrug.atxCode}</span></div>
                  </div>
                  <div>
                    <label className="form-label">{t('therapeuticGroup')}</label>
                    <div>{selectedDrug.therapeuticGroup[lang]}</div>
                  </div>
                  <div>
                    <label className="form-label">{t('form')}</label>
                    <div>{selectedDrug.form[lang]}</div>
                  </div>
                  <div>
                    <label className="form-label">{t('dosage')}</label>
                    <div>{selectedDrug.dosage}</div>
                  </div>
                  <div>
                    <label className="form-label">{t('prescription')}</label>
                    <div>
                      {selectedDrug.prescription ? (
                        <span className="badge badge-warning">{t('prescription')} (Rx)</span>
                      ) : (
                        <span className="badge badge-success">OTC</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">{t('manufacturer')}</label>
                    <div>{selectedDrug.manufacturer}, {selectedDrug.country[lang]}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedDrug(null)}>{t('close')}</button>
                <button className="btn btn-primary"><Edit size={16} /> {t('edit')}</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Drug Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{t('addDrug')}</h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('tradeName')} *</label>
                    <input type="text" className="form-input" placeholder={t('drugName')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('inn')}</label>
                    <input type="text" className="form-input" placeholder="INN" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('atxCode')}</label>
                    <input type="text" className="form-input" placeholder="N02BE01" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('therapeuticGroup')}</label>
                    <select className="form-input form-select">
                      <option value="">{t('selectGroup')}</option>
                      {therapeuticGroups.slice(1).map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('form')}</label>
                    <select className="form-input form-select">
                      <option value="">{t('selectForm')}</option>
                      <option value="tablets">{t('tablets')}</option>
                      <option value="capsules">{t('capsules')}</option>
                      <option value="solution">{t('solution')}</option>
                      <option value="powder">{t('powder')}</option>
                      <option value="gel">{t('gel')}</option>
                      <option value="cream">{t('cream')}</option>
                      <option value="syrup">{t('syrup')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('dosage')}</label>
                    <input type="text" className="form-input" placeholder="500mg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('manufacturer')}</label>
                    <input type="text" className="form-input" placeholder={t('manufacturer')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('country')}</label>
                    <input type="text" className="form-input" placeholder={t('countryOfOrigin')} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                      <span>{t('prescriptionDrug')}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
                <button className="btn btn-primary"><Plus size={16} /> {t('add')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
