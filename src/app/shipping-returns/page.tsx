
export default function ShippingReturnsPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-emerald-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Shipping & Returns</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Transparent policies to ensure a seamless shopping experience.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-serif text-emerald-950 mb-4">Shipping Policy</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        At Mahi Fashion Jewellery, we strive to deliver your precious products safely and on time. We partner with trusted logistics providers like Bluedart, Delhivery, and Sequel Logistics for secure transit.
                    </p>

                    <h3 className="text-xl font-serif text-emerald-900 mb-3">Delivery Timelines</h3>
                    <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
                        <li><strong>Standard Shipping:</strong> 5-7 business days for major cities.</li>
                        <li><strong>Express Shipping:</strong> 2-3 business days (available for select pincodes).</li>
                        <li><strong>Custom Orders:</strong> 15-20 business days for manufacturing and certification.</li>
                    </ul>

                    <h3 className="text-xl font-serif text-emerald-900 mb-3">Shipping Charges</h3>
                    <p className="text-gray-700 leading-relaxed mb-8">We offer <strong>Free Shipping</strong> on all orders above ₹5,000 within India. For orders below ₹5,000, a flat shipping fee of ₹150 applies.</p>

                    <hr className="my-12 border-emerald-100" />

                    <h2 className="text-2xl font-serif text-emerald-950 mb-4">Returns & Exchange Policy</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Your satisfaction is our priority. If you are not completely satisfied with your purchase, we are here to help.
                    </p>

                    <h3 className="text-xl font-serif text-emerald-900 mb-3">7-Day Return Policy</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        You can return any unworn, undamaged item with original tags and certification within 7 days of delivery for a full refund or exchange.
                    </p>

                    <h3 className="text-xl font-serif text-emerald-900 mb-3">Non-Returnable Items</h3>
                    <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
                        <li>Customized or personalized jewellery.</li>
                        <li>Items that have been worn or damaged.</li>
                        <li>Products missing the original certificate.</li>
                    </ul>

                    <h3 className="text-xl font-serif text-emerald-900 mb-3">Refund Process</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Once we receive and inspect your return (typically within 48 hours of receipt), we will initiate your refund. The amount will reflect in your original payment method within 5-7 business days.
                    </p>
                </div>
            </div>
        </div>
    )
}
