import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter your phone or WhatsApp number"),
  preferredContact: z.enum(["email", "phone", "whatsapp"], {
    required_error: "Please select a preferred contact method",
  }),
  supportType: z.enum(["myself", "someone-else", "professional", "general"], {
    required_error: "Please select the type of support you are looking for",
  }),
  serviceInterest: z.enum(["treatment-placement", "online-programme", "family-support", "free-assessment", "insight-os", "professional", "not-sure"], {
    required_error: "Please select the service you are interested in",
  }),
  message: z.string().min(10, "Please provide a brief message"),
  consent: z.boolean().refine((val) => val === true, "You must consent to proceed"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const API_BASE = "/api";

export function ContactForm() {
  const [location, navigate] = useLocation();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const formStartedAt = useMemo(() => Date.now(), []);
  const hasTrackedStart = useRef(false);
  const isSubmittingRef = useRef(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });

  async function onSubmit(data: ContactFormValues) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
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

      const response = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredContact: data.preferredContact,
          supportType: data.supportType,
          serviceInterest: data.serviceInterest,
          message: data.message,
          consent: data.consent,
          pageSource: location,
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

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      trackEvent("contact_form_submit", {
        form_name: "confidential_enquiry",
        service_interest: data.serviceInterest,
      });
      navigate("/thank-you");
    } catch {
      setIsError(true);
      isSubmittingRef.current = false;
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white p-8 md:p-12 border border-border shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onFocusCapture={() => {
            if (hasTrackedStart.current) return;
            hasTrackedStart.current = true;
            trackEvent("contact_form_start", {
              form_name: "confidential_enquiry",
            });
          }}
          className="space-y-6"
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {isError && (
            <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
              We were unable to submit your enquiry at this time. Please try again, or contact us directly by email.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Phone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Your phone number" className="rounded-none h-12 border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-medium">Preferred contact method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none h-12 border-input focus:ring-1 focus:ring-accent focus:border-accent">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none">
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="serviceInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">What would you like help with?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none h-12 border-input focus:ring-1 focus:ring-accent focus:border-accent">
                      <SelectValue placeholder="Select a service or choose not sure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    <SelectItem value="treatment-placement">Treatment placement or private rehab</SelectItem>
                    <SelectItem value="online-programme">Online Recovery Programme</SelectItem>
                    <SelectItem value="family-support">Family or intervention support</SelectItem>
                    <SelectItem value="free-assessment">Free assessment or results discussion</SelectItem>
                    <SelectItem value="insight-os">Insight OS</SelectItem>
                    <SelectItem value="professional">Professional partnership</SelectItem>
                    <SelectItem value="not-sure">I am not sure yet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">What support are you looking for?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-none h-12 border-input focus:ring-1 focus:ring-accent focus:border-accent">
                      <SelectValue placeholder="Select support type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none">
                    <SelectItem value="myself">I need help for myself</SelectItem>
                    <SelectItem value="someone-else">I need help for someone else</SelectItem>
                    <SelectItem value="professional">Professional or organisation enquiry</SelectItem>
                    <SelectItem value="general">General enquiry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-medium">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please briefly describe what you are looking for support with..."
                    className="min-h-[120px] rounded-none resize-y border-input focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-secondary/30 mt-6 border border-border/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50 mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer">
                    I understand that submitting this form does not create a therapeutic relationship. I consent to Insight Recovery Network using my details to respond to my enquiry.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-none h-14 text-base font-medium mt-4"
            disabled={isPending}
          >
            {isPending ? "Submitting…" : "Submit Confidential Enquiry"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Please avoid including unnecessary medical records or highly sensitive details. Read our{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-primary">
              Privacy Policy
            </Link>.
          </p>
        </form>
      </Form>
    </div>
  );
}
