import React from "react";
import Header from '@/components/custom/sections/header';
import Footer from "@/components/custom/sections/footer";
import Body from "@/components/custom/sections/body/home";

export default function Home() {
  return (
    <main>
      <Header/>
      <section className="min-h-screen">
        <Body/>
      </section>
      <Footer/>
    </main>
  );
}
