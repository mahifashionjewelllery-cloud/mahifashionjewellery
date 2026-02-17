require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkProducts() {
    console.log('🔍 Checking products in database...\n')

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.log('❌ Error:', error.message)
        return
    }

    console.log(`📊 Total products: ${products.length}\n`)

    if (products.length === 0) {
        console.log('⚠️  No products found in database!')
        console.log('   The product creation might have failed.')
    } else {
        console.log('✅ Products found:')
        products.forEach((product, i) => {
            console.log(`\n${i + 1}. ${product.name}`)
            console.log(`   ID: ${product.id}`)
            console.log(`   Metal: ${product.metal_type} (${product.purity})`)
            console.log(`   Weight: ${product.weight}g`)
            console.log(`   Stock: ${product.stock}`)
            console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`)
        })

        // Check for images
        console.log('\n📸 Checking product images...')
        const { data: images, error: imgError } = await supabase
            .from('product_images')
            .select('*')

        if (!imgError && images) {
            console.log(`   Found ${images.length} images`)
            images.forEach(img => {
                console.log(`   - Product ${img.product_id}: ${img.image_url}`)
            })
        }
    }
}

checkProducts()
