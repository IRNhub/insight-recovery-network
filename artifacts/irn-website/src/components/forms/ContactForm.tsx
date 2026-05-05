import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter your phone or WhatsApp number"),
  preferredContact: z.string({ required_error: "Please select a preferred contact method" }),
  supportType: z.string({ required_error: "Please select the type of support you are looking for" }),
  message: z.string().min(10, "Please provide a brief message"),
  consent: z.boolean().refine(val => val === true, "You must consent to proceed")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false
    }
  });

  function onSubmit(data: ContactFormValues) {
    console.log("Form submitted:", data);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="bg-secondary/30 p-8 md:p-12 border border-border/50 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-primary mb-3">Thank you.</h3>
        <p className="text-muted-foreground text-lg max-w-md">
          Your enquiry has been received securely. We will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 border border-border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" size="lg" className="w-full rounded-none h-14 text-base font-medium mt-4">
            Submit Confidential Enquiry
          </Button>
        </form>
      </Form>
    </div>
  );
}