import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/ui/cta-section";
import { LineChart, BookOpen, AlertCircle, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsightOS() {
  return (
    <Layout>
      <SEO
        title="Insight OS — Digital Recovery Management Platform"
        description="Insight OS is a dedicated digital platform for long-term recovery management. Track your health score, log triggers, get AI guidance, and use guided journaling."
        canonical="/insight-os"
      />
      {/* Product-style Hero */}
      <section className="relative overflow-hidden bg-primary pt-24 pb-32 lg:pt-32 lg:pb-48 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/162B3B/1A3344?text=')] opacity-50 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-6 font-sans">
            Digital Platform
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 max-w-4xl">
            The operating system for your recovery.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 font-light max-w-2xl mb-12">
            Insight OS combines clinical frameworks with daily digital engagement to monitor health, manage triggers, and sustain long-term recovery.
          </p>
          <a href="https://irnonline.app" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-none h-14 px-10 text-base bg-white text-primary hover:bg-white/90">
              Open Insight OS
            </Button>
          </a>
        </div>
      </section>

      {/* Product UI Placeholder / Mockup */}
      <section className="-mt-20 relative z-20 mb-24 px-6">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto bg-white shadow-2xl p-2 md:p-4 border border-border">
            <img 
              src="https://placehold.co/1200x800/FFFFFF/162B3B?text=Insight+OS+Dashboard" 
              alt="Insight OS Interface" 
              className="w-full h-auto opacity-90 border border-border/50"
              data-placeholder="true"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-6xl mx-auto">
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary mb-2">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-primary">Recovery Health Score</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                A quantitative metric generated from daily check-ins to track progress and identify declining trends before a crisis occurs.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-primary">Triggers & Warning Signs</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Log and monitor specific triggers. The system helps recognise patterns in environment, mood, and behaviour.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-primary">Anchor AI Guidance</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                An intelligent companion providing in-the-moment support, prompts, and clinical exercises tailored to current emotional states.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-primary">Guided Journaling</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Structured reflection tools that encourage daily processing and emotional regulation within a secure, private environment.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-primary mb-2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-primary">Recovery Academy</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Curated educational modules on neurobiology, addiction, mental health, and practical coping mechanisms.
              </p>
            </div>

          </div>
        </div>
      </section>

      <CTASection 
        heading="Ready to log in?"
        primaryCta={{ label: "Open Insight OS", href: "https://irnonline.app" }}
        isExternal={true}
      />
    </Layout>
  );
}