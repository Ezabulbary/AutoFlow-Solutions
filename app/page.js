'use client';

import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import HowItWorks from '@/components/HowItWorks';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Payment from '@/components/Payment';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import PaymentModal from '@/components/PaymentModal';
import ScrollFX from '@/components/ScrollFX';
import { useState } from 'react';

export default function Home() {
  const [toast, setToast] = useState(null);
  const [payModal, setPayModal] = useState(null); // { plan, amount }

  function showToast(msg, icon = '✅') {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 4000);
  }

  function openPayModal(plan, amount) {
    setPayModal({ plan, amount });
  }

  function closePayModal() {
    setPayModal(null);
  }

  return (
    <>
      <ScrollFX />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Services />
        <Pricing onSelectPlan={openPayModal} />
        <Payment onSelectPlan={openPayModal} />
        <Testimonials />
        <Faq />
        <Contact showToast={showToast} />
      </main>
      <Footer />
      {payModal && (
        <PaymentModal
          plan={payModal.plan}
          amount={payModal.amount}
          onClose={closePayModal}
          showToast={showToast}
        />
      )}
      <Toast toast={toast} />
    </>
  );
}
