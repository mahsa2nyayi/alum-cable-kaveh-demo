"use client";
import Hero from "./components/Hero";
import Why from "./components/why";
import Costumer from "./components/costumer";
import Certificates from "./components/certificates";
import News from "./components/news";
import QuickContact from "./components/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Why />
      <Costumer />
      <Certificates />
      <News />
      <QuickContact />
    </main>
  );
}
