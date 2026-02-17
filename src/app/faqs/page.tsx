

import { Plus, Minus } from 'lucide-react'

export default function FAQPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-emerald-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Find answers to common questions about our shipping, returns, and jewellery care.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="space-y-8">
                    {/* Orders & Shipping */}
                    <div>
                        <h2 className="font-serif text-2xl text-emerald-950 mb-6 border-b pb-2">Orders & Shipping</h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="How long does shipping take?"
                                answer="We process all orders within 24-48 hours. Standard domestic shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping timelines vary by destination."
                            />
                            <FAQItem
                                question="Do you ship internationally?"
                                answer="Yes, we ship to select countries worldwide. Shipping costs and customs duties are calculated at checkout based on your location."
                            />
                            <FAQItem
                                question="Can I track my order?"
                                answer="Absolutely! Once your order is shipped, you will receive a tracking ID via email and SMS to track your package in real-time."
                            />
                        </div>
                    </div>

                    {/* Returns & Exchange */}
                    <div>
                        <h2 className="font-serif text-2xl text-emerald-950 mb-6 border-b pb-2 pt-8">Returns & Exchange</h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="What is your return policy?"
                                answer="We offer a 7-day no-questions-asked return policy for all unworn items with original tags and packaging. Customized items are not eligible for return."
                            />
                            <FAQItem
                                question="How do I initiate a return?"
                                answer="You can initiate a return from your 'My Orders' section in the profile dashboard or contact our support team."
                            />
                        </div>
                    </div>

                    {/* Product & Care */}
                    <div>
                        <h2 className="font-serif text-2xl text-emerald-950 mb-6 border-b pb-2 pt-8">Product & Certification</h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="Is your jewellery certified?"
                                answer="Yes, all our gold jewellery is BIS Hallmarked, and diamonds are certified by IGI or SGL. You receive an authenticity certificate with every purchase."
                            />
                            <FAQItem
                                question="Do you offer customization?"
                                answer="Yes! We can customize ring sizes, metal purity, and even create bespoke designs. Please contact our support team for custom requests."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group border border-emerald-100 rounded-lg bg-emerald-50/30 overflow-hidden">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-emerald-950 hover:bg-emerald-50 transition-colors">
                <span>{question}</span>
                <span className="transition group-open:rotate-180">
                    <Plus className="h-5 w-5 text-emerald-600 group-open:hidden" />
                    <Minus className="h-5 w-5 text-emerald-600 hidden group-open:block" />
                </span>
            </summary>
            <div className="text-gray-600 p-4 pt-0 leading-relaxed border-t border-emerald-100/50">
                {answer}
            </div>
        </details>
    )
}
