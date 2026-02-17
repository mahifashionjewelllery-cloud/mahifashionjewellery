import { Gem, Droplets, Sun, Box } from 'lucide-react'

export default function JewelleryCarePage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-emerald-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Jewellery Care Guide</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Keep your precious pieces shining forever with these simple care tips.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2069&auto=format&fit=crop"
                            alt="Jewellery Care"
                            className="rounded-lg shadow-xl shadow-emerald-900/10"
                        />
                    </div>

                    <div className="space-y-8">
                        <CareItem
                            icon={Droplets}
                            title="Keep Away from Chemicals"
                            description="Avoid direct contact with perfumes, hairsprays, lotions, and cleaning agents as they can dull the shine of gold and gemstones."
                        />
                        <CareItem
                            icon={Sun}
                            title="Protect from Extreme Heat"
                            description="Store your jewellery away from direct sunlight and extreme temperatures to prevent discoloration and structural damage."
                        />
                        <CareItem
                            icon={Box}
                            title="Store Properly"
                            description="Always store each piece separately in a soft pouch or a lined jewellery box to prevent scratches and tangling."
                        />
                        <CareItem
                            icon={Gem}
                            title="Professional Cleaning"
                            description="Get your precious jewellery professionally cleaned and checked for loose prongs once a year to maintain its longevity."
                        />
                    </div>
                </div>

                <div className="mt-20 bg-emerald-50 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="font-serif text-3xl text-emerald-950 mb-6">Cleaning at Home</h2>
                    <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                        For a quick clean, soak your gold jewellery in warm water with a few drops of mild dish soap.
                        Gently brush with a soft toothbrush to remove dirt, rinse with clean water, and pat dry with a soft lint-free cloth.
                        <br /><br />
                        <strong>Note:</strong> Avoid using baking soda or toothpaste on delicate gemstones like pearls or opals.
                    </p>
                </div>
            </div>
        </div>
    )
}

function CareItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            <div>
                <h3 className="font-serif text-xl text-emerald-950 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
