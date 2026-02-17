require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkPolicies() {
    console.log('🔍 Checking metal_rates policies...\n')

    const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'metal_rates')

    if (error) {
        // pg_policies might not be accessible directly via JS client depending on permissions/setup
        // but let's try reading the table with anon key to simulate the issue
        console.log('Checking read access with ANON key...')
        const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const { data: rates, error: rateError } = await anonClient.from('metal_rates').select('*')

        if (rateError) console.log('❌ Anon read error:', rateError.message)
        else console.log(`ℹ️ Anon read result: ${rates.length} rows found`)
    } else {
        console.log('Policies found:', data)
    }

    // Just to be sure, let's explicitely add the policies via SQL if needed
    // But since I can't run SQL directly here easily without an SQL editor interface or rpc,
    // I'll create a SQL file to apply.
}

checkPolicies()
