require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkMetalRates() {
    console.log('🔍 Checking metal_rates table...\n')

    // Check data
    const { data: rates, error } = await supabase
        .from('metal_rates')
        .select('*')

    if (error) {
        console.log('❌ Error fetching rates:', error.message)
    } else {
        console.log(`✅ Found ${rates.length} rates in database:`)
        rates.forEach(r => console.log(`   - ${r.metal_type} ${r.purity}: ${r.rate_per_gram} (ID: ${r.id})`))
    }

    if (!rates || rates.length === 0) {
        console.log('\n⚠️ Table is empty! Inserting default rates...')
        const defaultRates = [
            { metal_type: 'gold', purity: '24K', rate_per_gram: 7200 },
            { metal_type: 'gold', purity: '22K', rate_per_gram: 6800 },
            { metal_type: 'gold', purity: '18K', rate_per_gram: 5600 },
            { metal_type: 'silver', purity: '92.5', rate_per_gram: 85 },
            { metal_type: 'silver', purity: 'pure', rate_per_gram: 90 }
        ]

        const { data: inserted, error: insertError } = await supabase
            .from('metal_rates')
            .insert(defaultRates)
            .select()

        if (insertError) {
            console.log('❌ Error inserting rates:', insertError.message)
        } else {
            console.log(`✅ Inserted ${inserted.length} default rates with UUIDs`)
            inserted.forEach(r => console.log(`   - ${r.metal_type} ${r.purity}: ${r.rate_per_gram} (ID: ${r.id})`))
        }
    }
}

checkMetalRates()
