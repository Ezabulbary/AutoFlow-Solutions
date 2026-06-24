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
import ScrollFX from '@/components/ScrollFX';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  function showToast(msg, icon = '✅') {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 4000);
  }

  // Payment requires an account. Send guests to register (then back to checkout),
  // and logged-in users straight to their dashboard with the plan preselected.
  function selectPlan(plan) {
    const target = `/dashboard?plan=${encodeURIComponent(plan)}`;
    if (user) router.push(target);
    else router.push(`/register?next=${encodeURIComponent(target)}`);
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
        <Pricing onSelectPlan={selectPlan} />
        <Payment onSelectPlan={selectPlan} />
        <Testimonials />
        <Faq />
        <Contact showToast={showToast} />
      </main>
      <Footer />
      <Toast toast={toast} />
    </>
  );
}
