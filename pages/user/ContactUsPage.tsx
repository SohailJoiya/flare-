import React from 'react';
import Card from '../../components/Card';
import Icon from '../../components/Icon';

const ContactUsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Contact Us</h1>
        <p className="text-lg text-gray-400 mt-2">
          We're here to help. Reach out with any questions or support needs.
        </p>
      </div>
      <Card>
        <div className="space-y-6">
          <a
            href="mailto:support@faearing.com"
            className="flex items-center p-4 bg-brand-dark/50 rounded-lg border border-gray-700 hover:border-brand-primary hover:bg-brand-surface transition-all duration-300 group"
          >
            <div className="flex-shrink-0 bg-brand-primary/10 text-brand-primary p-3 rounded-full mr-4">
              <Icon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Email Support</h3>
              <p className="text-brand-primary group-hover:underline">support@flareautoearning.com</p>
            </div>
            <div className="ml-auto text-gray-500 group-hover:text-white transition-colors">
              <Icon path="M9 5l7 7-7 7" className="h-5 w-5" />
            </div>
          </a>
          <a
            href="https://t.me/currencybwjjw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-brand-dark/50 rounded-lg border border-gray-700 hover:border-brand-primary hover:bg-brand-surface transition-all duration-300 group"
          >
            <div className="flex-shrink-0 bg-brand-primary/10 text-brand-primary p-3 rounded-full mr-4">
              <Icon path="M11.95 14.94l.46-2.25-2.32.99-2.2-1.03 8.1-3.41c.64-.26.23.1.02.26l-6.1 5.46-1.77 5.43c.27-.05.51-.17.7-.33l1.9-1.82 3.84 2.82c.4.23.83.12 1-.29l2.4-11.4c.23-.9-.45-1.38-1.12-1.12l-12.8 4.94c-.9.34-.89.88-.14 1.1l3.23.99 7.4-4.66c.35-.22.67-.1.39.18" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Telegram Group</h3>
              <p className="text-brand-primary group-hover:underline">Join our community</p>
            </div>
             <div className="ml-auto text-gray-500 group-hover:text-white transition-colors">
              <Icon path="M9 5l7 7-7 7" className="h-5 w-5" />
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default ContactUsPage;
