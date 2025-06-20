
import React from 'react';
import { FAQItem } from '../types';
import { ChevronDown, Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';

const faqs: FAQItem[] = [
  {
    question: "How quickly will my fuel be delivered?",
    answer: "We promise delivery within 10 minutes for most locations under normal conditions. You can track your delivery captain in real-time via the app."
  },
  {
    question: "Is there a minimum order quantity?",
    answer: "Yes, the minimum order quantity is typically 5 litres. This may vary slightly based on location or promotions."
  },
  {
    question: "What are the payment options?",
    answer: "We accept all major UPI apps, credit cards, debit cards, and net banking through our secure payment gateway."
  },
  {
    question: "Is the fuel quality assured?",
    answer: "Absolutely. We source fuel directly from reputed oil companies and follow strict quality control measures to ensure you get the best quality fuel."
  },
  {
    question: "What if I need to cancel my order?",
    answer: "You can cancel your order through the app before a delivery captain is assigned or en route. Please check the app for specific cancellation policies."
  }
];

const FAQAccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  return (
    <details className="group border-b border-gray-200 py-3">
      <summary className="flex justify-between items-center cursor-pointer list-none">
        <span className="text-md font-medium text-gray-700 group-hover:text-primary">{item.question}</span>
        <ChevronDown size={20} className="text-gray-500 group-open:rotate-180 transition-transform duration-200" />
      </summary>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.answer}</p>
    </details>
  );
};

const HelpSupportScreen: React.FC = () => {
  return (
    <div className="pb-4">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        {/* Contact Options */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => alert("Starting support chat... (Not implemented)")}
              leftIcon={<MessageCircle size={20} />}
              className="justify-start text-left py-3 h-auto"
            >
              <div className="ml-2">
                <span className="font-semibold block">Chat with Us</span>
                <span className="text-xs text-gray-500">Typically replies in minutes</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => alert("Calling customer service... (Not implemented)")}
              leftIcon={<Phone size={20} />}
              className="justify-start text-left py-3 h-auto"
            >
               <div className="ml-2">
                <span className="font-semibold block">Call Us</span>
                <span className="text-xs text-gray-500">Available 9 AM - 9 PM</span>
              </div>
            </Button>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-1">
            {faqs.map((faq, index) => (
              <FAQAccordionItem key={index} item={faq} />
            ))}
          </div>
        </section>

        {/* Report an Issue */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Report an Issue</h3>
           <Button 
              variant="danger"
              fullWidth 
              onClick={() => alert("Report issue form... (Not implemented)")}
              leftIcon={<AlertTriangle size={20} />}
            >
              Report Problem with a Past Order
            </Button>
        </section>
      </div>
    </div>
  );
};

export default HelpSupportScreen;
