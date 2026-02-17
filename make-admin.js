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

async function makeUserAdmin() {
    console.log('🔧 Making sha@gmail.com an admin...\n')

    // First, find the user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
        console.log('❌ Error fetching users:', userError.message)
        return
    }

    const user = users.users.find(u => u.email === 'sha@gmail.com')

    if (!user) {
        console.log('❌ User sha@gmail.com not found!')
        console.log('   Please register this account first at /register')
        return
    }

    // Update the profile to admin
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
        .select()

    if (error) {
        console.log('❌ Error:', error.message)
        return
    }

    console.log('✅ User updated successfully!')
    console.log('   Email:', user.email)
    console.log('   User ID:', user.id)
    console.log('   Role: admin')
    console.log('\n🎉 You can now access the admin panel!')
    console.log('   Login with: sha@gmail.com / test123')
    console.log('   Go to: http://localhost:3000/admin')
}

makeUserAdmin()
