require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function checkAuth() {
    console.log('🔍 Checking Authentication Setup...\n')

    // Check if any users exist
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
        console.log('❌ Error fetching users:', usersError.message)
        return
    }

    console.log(`📊 Total users in database: ${users.users.length}`)

    if (users.users.length === 0) {
        console.log('\n⚠️  No users found!')
        console.log('   You need to register a new account first.')
        console.log('   Go to: http://localhost:3000/register\n')
    } else {
        console.log('\n✅ Users found:')
        users.users.forEach((user, i) => {
            console.log(`   ${i + 1}. Email: ${user.email || 'N/A'}`)
            console.log(`      Phone: ${user.phone || 'N/A'}`)
            console.log(`      Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
            console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`)
        })
    }

    // Check profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')

    if (profilesError) {
        console.log('\n❌ Error fetching profiles:', profilesError.message)
        return
    }

    console.log(`\n📊 Total profiles: ${profiles.length}`)
    if (profiles.length > 0) {
        console.log('✅ Profiles found:')
        profiles.forEach((profile, i) => {
            console.log(`   ${i + 1}. Name: ${profile.full_name || 'N/A'}`)
            console.log(`      Role: ${profile.role}`)
            console.log(`      Phone: ${profile.phone || 'N/A'}`)
        })
    }

    console.log('\n📋 Next Steps:')
    if (users.users.length === 0) {
        console.log('   1. Go to http://localhost:3000/register')
        console.log('   2. Create a new account')
        console.log('   3. Try logging in')
    } else {
        console.log('   1. Try logging in with one of the accounts above')
        console.log('   2. Check browser console (F12) for any errors')
        console.log('   3. Make sure email confirmation is disabled in Supabase')
    }
}

checkAuth()
