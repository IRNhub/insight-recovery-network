import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

// Monetary value attached to each Lead event, so Meta treats these as high-value
// conversions. Representative figure: change this single number to your real
// typical deal value if different.
const LEAD_VALUE_GBP = 75;

const API_BASE = "/api";

const REACHING_FOR: Record<string, { label: string; supportType: string }> = {
  "loved-one": { label: "A loved one", supportType: "someone-else" },
  myself: { label: "Myself", supportType: "myself" },
  other: { label: "Someone else / prefer not to say", supportType: "general" },
};

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter your phone or WhatsApp number"),
  reachingFor: z.enum(["loved-one", "myself", "other"], {
    required_error: "Please choose the option that best fits",
  }),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "Please tick to consent"),
});

type FormValues = z.infer<typeof formSchema>;

const differencePoints = [
  {
    title: "Twenty years of clinical experience",
    body: "Two decades specialising in alcohol and cocaine addiction, across residential treatment and complex cases.",
  },
  {
    title: "Lived experience, not just theory",
    body: "Our founder is in long-term recovery himself. This work is understood from both sides.",
  },
  {
    title: "Clinically led and direct",
    body: "Honest guidance with no shame and no scripts. We will tell you plainly what is likely to help.",
  },
  {
    title: "No pressure, no judgement",
    body: "You decide what happens next. Our job is to help you see the options clearly.",
  },
];

const faqs = [
  {
    q: "Is this confidential?",
    a: "Yes. Your enquiry is private. Nothing is shared with your loved one or with anyone else. We only use your details to respond to you.",
  },
  {
    q: "What happens on the call?",
    a: "A calm, confidential conversation about your situation and the realistic options. No pressure and no obligation to go further.",
  },
  {
    q: "Do we have to commit to anything?",
    a: "No. The conversation exists to help you understand the options and decide whether any of them are right for you. You stay in control.",
  },
  {
    q: "What if my loved one refuses help?",
    a: "This is one of the most common things people ask about. We can talk through how to approach it calmly, without ultimatums or coercion.",
  },
  {
    q: "Do you only work with people in the UK?",
    a: "We are UK clinically led and work with people across the UK, whether for yourself or a loved one, with treatment options both in the UK and overseas.",
  },
];

function EnquiryForm() {
  const [, navigate] = useLocation();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const formStartedAt = useMemo(() => Date.now(), []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", consent: false },
  });

  async function onSubmit(data: FormValues) {
    setIsPending(true);
    setIsError(false);
    try {
      const url = new URL(window.location.href);
      const landingPage = (() => {
        try {
          const stored = window.sessionStorage.getItem("irn_landing_page");
          if (stored) return stored;
          const value = `${window.location.pathname}${window.location.search}`;
          window.sessionStorage.setItem("irn_landing_page", value);
          return value;
        } catch {
          return `${window.location.pathname}${window.location.search}`;
        }
      })();

      const reaching =
        REACHING_FOR[data.reachingFor] ?? { label: data.reachingFor, supportType: "general" };
      const composedMessage =
        `Enquiry via get-help (Facebook ad). Reaching out for: ${reaching.label}.` +
        (data.message && data.message.trim() ? ` Message: ${data.message.trim()}` : "");

      const response = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredContact: "phone",
          supportType: reaching.supportType,
          message: composedMessage,
          consent: data.consent,
          pageSource: "/get-help",
          landingPage,
          currentPage: `${window.location.pathname}${window.location.search}`,
          referrer: document.referrer || "",
          utmSource: url.searchParams.get("utm_source") || "",
          utmMedium: url.searchParams.get("utm_medium") || "",
          utmCampaign: url.searchParams.get("utm_campaign") || "",
          utmTerm: url.searchParams.get("utm_term") || "",
          utmContent: url.searchParams.get("utm_content") || "",
          formStartedAt,
          website: "",
        }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      // Meta Pixel: report a successful enquiry as a Lead for ad optimisation.
      const w = window as unknown as { fbq?: (...args: unknown[]) => void };
      if (typeof w.fbq === "function") {
        w.fbq("track", "Lead", {
          value: LEAD_VALUE_GBP,
          currency: "GBP",
          content_name: "get-help enquiry",
        });
      }
      navigate("/thank-you");
    } catch {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 border border-border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
              We were unable to submit your enquiry just now. Please try again, or email
              info@insightrecoverynetwork.com directly.
            </div>
          )}

          {/* Gentle, non-financial routing question */}
          <FormField
            control={form.control}
            name="reachingFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">
                  Who are you reaching out for?
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none h-12 border-input focus:ring-1 focus:ring-accent focus:border-accent">
                      <SelectValue placeholder="Choose one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    <SelectItem value="loved-one">A loved one</SelectItem>
                    <SelectItem value="myself">Myself</SelectItem>
                    <SelectItem value="other">Someone else / prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Your name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Phone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Your number"
                      className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">
                  Anything you would like us to know (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A few words about your situation, if you wish."
                    className="min-h-[96px] rounded-none resize-y border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-secondary/30 border border-border/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50 mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer">
                    I consent to Insight Recovery Network using my details to respond to my enquiry. I
                    understand this does not create a therapeutic relationship.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-none h-14 text-base font-medium"
            disabled={isPending}
          >
            {isPending ? "Sending…" : "Request my free, confidential assessment"}
          </Button>
          <p className="text-xs text-muted-foreground/70 text-center">
            Free, private and confidential. We usually respond the same day.
          </p>
        </form>
      </Form>
    </div>
  );
}

export default function GetHelp() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <SEO
        title="Free Confidential Addiction Support"
        fullTitle="Free, Confidential Addiction Support for You or Someone You Love | Insight Recovery Network"
        description="Living with addiction, your own or a loved one's, is overwhelming, and knowing what to do next is hard. Insight Recovery Network helps you take the guesswork out of getting help. Free, confidential and clinically led."
        canonical="/get-help"
        ogImage="https://www.insightrecoverynetwork.com/get-help-hero.png"
        noIndex
      />

      {/* No separate header: the IRN logo and tagline are part of the hero image below. */}
      <main className="flex-1">
        {/* ── Hero banner (branded image: IRN logo + tagline are baked into the artwork) ── */}
        <section className="bg-primary">
          <div className="relative w-full overflow-hidden h-[320px] sm:h-[420px] lg:h-[500px]">
            <img
              src="/get-help-hero.png"
              alt="Insight Recovery Network, a calm coastline at sunset"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "left top" }}
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </section>

        {/* ── Headline + primary CTA ── */}
        <section className="bg-primary text-primary-foreground border-b border-primary/20">
          <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-accent/90 mb-5">
                Confidential addiction support, for you or someone you love
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-tight text-white mb-6">
                Let us take the guesswork out of getting help.
              </h1>
              <p className="text-lg md:text-xl text-white/85 font-light leading-relaxed mb-9 max-w-xl">
                Whether it is you or someone you love, living with addiction is exhausting and
                confusing, and knowing what to do next is the hardest part. You do not have to work it
                out alone. Start with a free, confidential conversation.
              </p>
              <a
                href="#book"
                className="inline-flex items-center justify-center h-14 px-9 bg-white text-primary text-base font-medium hover:bg-white/90 transition-colors"
              >
                Request a free assessment
              </a>
              <div className="flex items-center gap-2 text-white/70 text-sm mt-5">
                <Shield className="w-4 h-4 text-accent" />
                Free, confidential, no obligation
              </div>
            </div>
          </div>
        </section>

        {/* ── Empathy ── */}
        <section className="py-12 md:py-20 border-b border-border/40">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Living alongside addiction, or living with it yourself, is exhausting. The worry that
                does not switch off. The promises made and broken. The hope that lifts and then falls
                again. And underneath all of it, the hardest question of all: what do we actually do
                next?
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                That is the part we take off your shoulders. You do not need to have it all worked
                out, and you are not to blame. One honest, confidential conversation can replace the
                guesswork with a clear, realistic picture of the options, with no pressure to go
                further than you want to.
              </p>
            </div>
          </div>
        </section>

        {/* ── Booking / enquiry form (moved high, directly under the opening message) ── */}
        <section id="book" className="py-12 md:py-20 bg-secondary/20 scroll-mt-4">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                  Request your free, confidential assessment
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Tell us a little about what is going on and the best way to reach you. It is
                  completely free and confidential, with no pressure and no obligation. We usually
                  respond the same day.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <Shield className="w-4 h-4 text-accent" />
                  Free, confidential and secure
                </div>
              </div>
              <div className="lg:col-span-7">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── Signature pull-quote ── */}
        <section className="py-12 md:py-16 bg-primary">
          <div className="container mx-auto px-6 md:px-12">
            <blockquote className="max-w-3xl mx-auto text-center">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-snug">
                Being sober stops the bleeding. Recovery is what heals the scar.
              </p>
            </blockquote>
          </div>
        </section>

        {/* ── The IRN difference ── */}
        <section className="py-12 md:py-20 border-b border-border/40">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                Why people trust this approach
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This is not a call centre or a referral broker. It is clinically led guidance from
                people who understand addiction from the inside.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {differencePoints.map((p) => (
                <div key={p.title} className="border border-border/40 bg-white p-6">
                  <h3 className="font-serif text-lg font-medium text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a
                href="#book"
                className="inline-flex items-center justify-center h-14 px-9 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
              >
                Request a free assessment
              </a>
            </div>
          </div>
        </section>

        {/* ── What is on offer ── */}
        <section className="py-12 md:py-20 border-b border-border/40 bg-secondary/20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary mb-5">
                The kind of help available
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on what your situation needs, we help with two main routes, both with UK
                clinical oversight.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border/40 bg-white p-7">
                <h3 className="font-serif text-xl font-medium text-primary mb-3">
                  Structured online recovery
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A clinically led online recovery programme with one-to-one support, structure and
                  relapse prevention, alongside the Insight OS recovery tools. Suitable where
                  residential care is not needed.
                </p>
              </div>
              <div className="border border-border/40 bg-white p-7">
                <h3 className="font-serif text-xl font-medium text-primary mb-3">
                  Private treatment placement
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Independent guidance on private residential treatment in carefully chosen facilities
                  in South Africa, Thailand, Spain and Sri Lanka. We are independent of the facilities
                  we discuss, so the advice is based on what is right, not who pays us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Founder note ── */}
        <section className="py-12 md:py-20 border-b border-border/40 bg-primary">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-accent/90 mb-5">
                A note from the founder
              </p>
              <div className="space-y-5 text-white/85 text-lg leading-relaxed font-light">
                <p>
                  I am Craig Bilton, founder of Insight Recovery Network. I have spent over twenty
                  years specialising in alcohol and cocaine addiction, across residential treatment
                  and complex cases. I am also in long-term recovery myself.
                </p>
                <p>
                  I know what this takes, because I have been on both sides of it. When we speak, you
                  will get an honest, clinical view of your situation and the realistic options, with
                  no shame and no pressure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-12 md:py-20 border-b border-border/40">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-primary">
                Questions people ask
              </h2>
            </div>
            <div className="max-w-3xl space-y-7">
              {faqs.map((f) => (
                <div key={f.q} className="border-b border-border/40 pb-7 last:border-b-0">
                  <h3 className="font-serif text-xl font-medium text-primary mb-2">{f.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a
                href="#book"
                className="inline-flex items-center justify-center h-14 px-9 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
              >
                Request a free assessment
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Minimal footer ── */}
      <footer className="bg-primary text-primary-foreground py-10 border-t border-primary/20">
        <div className="container mx-auto px-6 md:px-12">
          <p className="text-xs text-primary-foreground/40 leading-relaxed max-w-3xl mb-6">
            Insight Recovery Network provides private support and treatment guidance, not regulated
            medical treatment or emergency care. If someone is in immediate danger, call 999. For
            emotional support at any time, the Samaritans are available on 116 123, free, 24/7.
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Insight Recovery Network</p>
            <div className="flex flex-wrap gap-5">
              <a
                href="mailto:info@insightrecoverynetwork.com"
                className="hover:text-accent transition-colors"
              >
                info@insightrecoverynetwork.com
              </a>
              <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-accent transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
