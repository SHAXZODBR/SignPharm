import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/atx - Get ATX classification tree
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const level = searchParams.get('level') || '1'
        const parent = searchParams.get('parent')

        // Try to fetch from ATXClassification table
        const { data, error } = await supabase
            .from('ATXClassification')
            .select('*')
            .eq('level', parseInt(level))
            .order('code')

        if (error || !data?.length) {
            // Return standard ATX classification if table doesn't exist
            return NextResponse.json(getStandardATX(level, parent))
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching ATX:', error)
        return NextResponse.json(getStandardATX('1', null))
    }
}

function getStandardATX(level: string, parent: string | null) {
    // WHO ATC classification - Level 1 (Anatomical main group)
    const level1 = [
        { code: 'A', name: 'Alimentary tract and metabolism', nameRu: 'Пищеварительный тракт и обмен веществ', nameUz: "Ovqat hazm qilish va moddalar almashinuvi", level: 1, childCount: 16 },
        { code: 'B', name: 'Blood and blood forming organs', nameRu: 'Кровь и кроветворные органы', nameUz: 'Qon va qon hosil qiluvchi organlar', level: 1, childCount: 6 },
        { code: 'C', name: 'Cardiovascular system', nameRu: 'Сердечно-сосудистая система', nameUz: 'Yurak-qon tomir tizimi', level: 1, childCount: 10 },
        { code: 'D', name: 'Dermatologicals', nameRu: 'Дерматологические препараты', nameUz: 'Dermatologik preparatlar', level: 1, childCount: 11 },
        { code: 'G', name: 'Genito-urinary system and sex hormones', nameRu: 'Мочеполовая система и половые гормоны', nameUz: "Siydik-tanosil tizimi va jinsiy gormonlar", level: 1, childCount: 4 },
        { code: 'H', name: 'Systemic hormonal preparations', nameRu: 'Системные гормональные препараты', nameUz: 'Tizimli gormonal preparatlar', level: 1, childCount: 5 },
        { code: 'J', name: 'Antiinfectives for systemic use', nameRu: 'Противомикробные препараты для системного применения', nameUz: 'Tizimli antimikrob preparatlar', level: 1, childCount: 7 },
        { code: 'L', name: 'Antineoplastic and immunomodulating agents', nameRu: 'Противоопухолевые и иммуномодулирующие препараты', nameUz: "O'simtalarga qarshi va immunomodulyator preparatlar", level: 1, childCount: 4 },
        { code: 'M', name: 'Musculo-skeletal system', nameRu: 'Костно-мышечная система', nameUz: 'Suyak-mushak tizimi', level: 1, childCount: 9 },
        { code: 'N', name: 'Nervous system', nameRu: 'Нервная система', nameUz: 'Nerv tizimi', level: 1, childCount: 7 },
        { code: 'P', name: 'Antiparasitic products, insecticides', nameRu: 'Противопаразитарные препараты', nameUz: 'Parazitlarga qarshi preparatlar', level: 1, childCount: 3 },
        { code: 'R', name: 'Respiratory system', nameRu: 'Дыхательная система', nameUz: 'Nafas olish tizimi', level: 1, childCount: 7 },
        { code: 'S', name: 'Sensory organs', nameRu: 'Органы чувств', nameUz: 'Sezgi organlari', level: 1, childCount: 3 },
        { code: 'V', name: 'Various', nameRu: 'Прочие', nameUz: 'Boshqalar', level: 1, childCount: 9 },
    ]

    // Level 2 examples (for some common groups)
    const level2: Record<string, any[]> = {
        'A': [
            { code: 'A01', name: 'Stomatological preparations', nameRu: 'Стоматологические препараты', level: 2, parentCode: 'A' },
            { code: 'A02', name: 'Drugs for acid related disorders', nameRu: 'Препараты для лечения кислотозависимых заболеваний', level: 2, parentCode: 'A' },
            { code: 'A03', name: 'Drugs for functional gastrointestinal disorders', nameRu: 'Препараты для функциональных нарушений ЖКТ', level: 2, parentCode: 'A' },
            { code: 'A04', name: 'Antiemetics and antinauseants', nameRu: 'Противорвотные препараты', level: 2, parentCode: 'A' },
            { code: 'A05', name: 'Bile and liver therapy', nameRu: 'Препараты для печени и желчевыводящих путей', level: 2, parentCode: 'A' },
            { code: 'A06', name: 'Drugs for constipation', nameRu: 'Слабительные', level: 2, parentCode: 'A' },
            { code: 'A07', name: 'Antidiarrheals', nameRu: 'Противодиарейные препараты', level: 2, parentCode: 'A' },
            { code: 'A10', name: 'Drugs used in diabetes', nameRu: 'Противодиабетические препараты', level: 2, parentCode: 'A' },
            { code: 'A11', name: 'Vitamins', nameRu: 'Витамины', level: 2, parentCode: 'A' },
            { code: 'A12', name: 'Mineral supplements', nameRu: 'Минеральные добавки', level: 2, parentCode: 'A' },
        ],
        'C': [
            { code: 'C01', name: 'Cardiac therapy', nameRu: 'Препараты для лечения заболеваний сердца', level: 2, parentCode: 'C' },
            { code: 'C02', name: 'Antihypertensives', nameRu: 'Антигипертензивные препараты', level: 2, parentCode: 'C' },
            { code: 'C03', name: 'Diuretics', nameRu: 'Диуретики', level: 2, parentCode: 'C' },
            { code: 'C05', name: 'Vasoprotectives', nameRu: 'Вазопротекторы', level: 2, parentCode: 'C' },
            { code: 'C07', name: 'Beta blocking agents', nameRu: 'Бета-адреноблокаторы', level: 2, parentCode: 'C' },
            { code: 'C08', name: 'Calcium channel blockers', nameRu: 'Блокаторы кальциевых каналов', level: 2, parentCode: 'C' },
            { code: 'C09', name: 'Agents acting on the renin-angiotensin system', nameRu: 'Препараты, влияющие на РААС', level: 2, parentCode: 'C' },
            { code: 'C10', name: 'Lipid modifying agents', nameRu: 'Гиполипидемические препараты', level: 2, parentCode: 'C' },
        ],
        'J': [
            { code: 'J01', name: 'Antibacterials for systemic use', nameRu: 'Антибактериальные препараты', level: 2, parentCode: 'J' },
            { code: 'J02', name: 'Antimycotics for systemic use', nameRu: 'Противогрибковые препараты', level: 2, parentCode: 'J' },
            { code: 'J04', name: 'Antimycobacterials', nameRu: 'Противотуберкулёзные препараты', level: 2, parentCode: 'J' },
            { code: 'J05', name: 'Antivirals for systemic use', nameRu: 'Противовирусные препараты', level: 2, parentCode: 'J' },
            { code: 'J06', name: 'Immune sera and immunoglobulins', nameRu: 'Иммуноглобулины', level: 2, parentCode: 'J' },
            { code: 'J07', name: 'Vaccines', nameRu: 'Вакцины', level: 2, parentCode: 'J' },
        ],
        'N': [
            { code: 'N01', name: 'Anesthetics', nameRu: 'Анестетики', level: 2, parentCode: 'N' },
            { code: 'N02', name: 'Analgesics', nameRu: 'Анальгетики', level: 2, parentCode: 'N' },
            { code: 'N03', name: 'Antiepileptics', nameRu: 'Противоэпилептические препараты', level: 2, parentCode: 'N' },
            { code: 'N04', name: 'Anti-parkinson drugs', nameRu: 'Противопаркинсонические препараты', level: 2, parentCode: 'N' },
            { code: 'N05', name: 'Psycholeptics', nameRu: 'Психолептики', level: 2, parentCode: 'N' },
            { code: 'N06', name: 'Psychoanaleptics', nameRu: 'Психоаналептики', level: 2, parentCode: 'N' },
            { code: 'N07', name: 'Other nervous system drugs', nameRu: 'Другие препараты для нервной системы', level: 2, parentCode: 'N' },
        ],
    }

    if (level === '1') {
        return level1
    }

    if (level === '2' && parent) {
        return level2[parent] || []
    }

    return level1
}
