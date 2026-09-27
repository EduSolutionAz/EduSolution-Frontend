import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/home/Hero';
import AdBoard from '../components/home/AdBoard';
import CountrySearch from '../components/home/CountrySearch';
import WorkingWith from '../components/home/WorkingWith';
import Services from '../components/home/Services';
import Partners from '../components/home/Partners';
import WhyUs from '../components/home/WhyUs';
import NumbersBand from '../components/home/NumbersBand';
import Steps from '../components/home/Steps';
import Testimonials from '../components/home/Testimonials';
import ContactSection from '../components/home/ContactSection';
import HomeFaq from '../components/home/HomeFaq';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        <AdBoard />
        <CountrySearch />
        <WorkingWith />
        <Services />
        <Partners />
        <WhyUs />
        <Steps />
        <NumbersBand />
        <Testimonials />
        <ContactSection />
        <HomeFaq />
      </main>
      <Footer />
    </div>
  );
}