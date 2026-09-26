import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { EnquiryForm } from "./EnquiryForm";
import { discussionLabels, initialJourneyAnswers, type EnquiryJourneyOptions, type JourneyAnswers } from "./enquiry-journey-data";
import "./EnquiryJourney.css";

export type { EnquiryJourneyOptions } from "./enquiry-journey-data";

const questions = [
  {
    key: "who", eyebrow: "A little about your situation", title: "Who are you looking for help for?",
    note: "You do not need to have all the answers to begin.",
    options: [
      ["myself", "Myself", "I am exploring support for my own situation."],
      ["someone-else", "Someone I care about", "A family member, partner or friend."],
      ["professional", "Someone I support professionally", "I am exploring support on someone else’s behalf."],
      ["general", "I would rather discuss this", "We can start with a conversation."],
    ],
  },
  {
    key: "service", eyebrow: "The kind of support", title: "What would you like help with?",
    note: "Choose the closest fit. You can change your mind.",
    options: [
      ["treatment-placement", "Finding private treatment", "Understanding suitable treatment options and admission."],
      ["family-support", "Guidance for our family", "Making sense of the situation and possible next steps."],
      ["online-programme", "Online recovery support", "Exploring support that can be accessed from home."],
      ["not-sure", "I am not sure yet", "I would like help understanding the options."],
    ],
  },
  {
    key: "discussion", eyebrow: "A useful starting point", title: "What would be most useful to discuss first?",
    note: "Choose a starting point. We can take it from there.",
    options: [
      ["options", discussionLabels.options, "What different types of support involve."],
      ["costs", discussionLabels.costs, "What to consider when planning private treatment."],
      ["next-steps", discussionLabels["next-steps"], "What happens when we ask for help."],
      ["not-sure", discussionLabels["not-sure"], "I would appreciate some guidance."],
    ],
  },
] as const;

const JourneyContext = createContext<{ open: (options?: EnquiryJourneyOptions) => void } | null>(null);

export function useEnquiryJourney() {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useEnquiryJourney requires EnquiryJourneyProvider");
  return context;
}

export function EnquiryJourneyProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<EnquiryJourneyOptions>({});
  const [session, setSession] = useState(0);
  const [pending, setPending] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const previousLocation = useRef(location);
  const open = useCallback((next: EnquiryJourneyOptions = {}) => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOptions(next);
    setSession((current) => current + 1);
    setPending(false);
    setIsOpen(true);
  }, []);
  useEffect(() => {
    if (previousLocation.current !== location) {
      setIsOpen(false);
      previousLocation.current = location;
    }
  }, [location]);

  return (
    <JourneyContext.Provider value={{ open }}>
      {children}
      <Dialog.Root open={isOpen} onOpenChange={(next) => { if (!pending) setIsOpen(next); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="irn-ej-overlay" />
          <Dialog.Content
            ref={content}
            className="irn-ej-dialog"
            onOpenAutoFocus={(event) => { event.preventDefault(); requestAnimationFrame(() => content.current?.querySelector<HTMLElement>(".irn-ej-heading")?.focus()); }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const element = trigger.current;
              if (element?.isConnected && element.getClientRects().length) element.focus({ preventScroll: true });
            }}
            onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }}
            onPointerDownOutside={(event) => { if (pending) event.preventDefault(); }}
          >
            <div className="irn-ej-top">
              <div>
                <Dialog.Title className="irn-ej-label">A confidential first step</Dialog.Title>
                <Dialog.Description className="sr-only">Answer three optional questions, then choose how IRN may contact you. You can go straight to contact details.</Dialog.Description>
              </div>
              <Dialog.Close className="irn-ej-close" disabled={pending} aria-label="Close enquiry">
                <X size={20} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <EnquiryJourney key={session} options={options} onAccepted={() => setIsOpen(false)} onPendingChange={setPending} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </JourneyContext.Provider>
  );
}

export function EnquiryJourney({ options = {}, inline = false, variant = "get-help", onAccepted, onPendingChange }: {
  options?: EnquiryJourneyOptions;
  inline?: boolean;
  variant?: "get-help" | "contact";
  onAccepted?: () => void;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [answers, setAnswers] = useState<JourneyAnswers>(() => initialJourneyAnswers(options));
  const [step, setStep] = useState(options.direct ? 3 : 0);
  const [history, setHistory] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  const id = useId();
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (!interacted.current) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [step]);
  function goTo(next: number) {
    interacted.current = true;
    setHistory((current) => [...current, step]);
    setStep(next);
  }
  function back() {
    interacted.current = true;
    setStep(history.at(-1) ?? 0);
    setHistory((current) => current.slice(0, -1));
  }
  const question = questions[Math.min(step, 2)];
  const setAnswer = (value: string) => setAnswers((current) => ({ ...current, [question.key]: value }));
  return (
    <div id={inline ? "book" : undefined} className={`irn-ej ${inline ? "irn-ej-inline" : ""}`}>
      <div className="irn-ej-progress" aria-hidden="true">{[0, 1, 2, 3].map((index) => <span key={index} data-complete={index <= step} />)}</div>
      <p className="irn-ej-step">{step === 3 ? "Your contact preferences" : `Question ${step + 1} of 3`} <span aria-hidden="true">·</span> Step {step + 1} of 4</p>
      <p className="irn-ej-eyebrow">{step === 3 ? "A discreet first conversation" : question.eyebrow}</p>
      <h2 id={`${id}-heading`} ref={heading} tabIndex={-1} className="irn-ej-heading">{step === 3 ? "How would you prefer to be contacted?" : question.title}</h2>
      <p className="irn-ej-intro">{step === 3 ? "IRN provides private, paid support. An enquiry does not commit you to a service. Choose how you would prefer to speak." : question.note}</p>
      {step < 3 && <>
        <div className="irn-ej-choices" role="group" aria-labelledby={`${id}-heading`}>
          {question.options.map(([value, label, detail]) => <button key={value} type="button" className="irn-ej-choice" aria-pressed={answers[question.key] === value} onClick={() => setAnswer(value)} disabled={!ready}>
            <span className="irn-ej-marker" aria-hidden="true">{answers[question.key] === value && <Check size={14} />}</span>
            <span><span className="irn-ej-choice-label">{label}</span><span className="irn-ej-choice-detail">{detail}</span></span>
          </button>)}
        </div>
        <div className="irn-ej-actions">
          {step > 0 ? <button type="button" className="irn-ej-text" onClick={back}><ArrowLeft size={16} aria-hidden="true" /> Back</button> : <span />}
          <button type="button" className="irn-ej-primary" disabled={!answers[question.key] || !ready} onClick={() => goTo(step + 1)}>{step === 2 ? "Contact preferences" : "Continue"} <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
        <button className="irn-ej-text irn-ej-direct" type="button" disabled={!ready} onClick={() => goTo(3)}>Go straight to contact details</button>
        <noscript><p>Please call <a href="tel:+447415994475">+44 7415 994475</a> or email <a href="mailto:info@insightrecoverynetwork.com">info@insightrecoverynetwork.com</a> to enquire without JavaScript.</p></noscript>
      </>}
      <div className="irn-ej-contact" hidden={step !== 3}>
        <details className="irn-ej-answer-summary">
          <summary>Your starting point</summary>
          <dl>{questions.map((item) => <div key={item.key}><dt>{item.key === "who" ? "Help for" : item.key === "service" ? "Help with" : "Discuss first"}</dt><dd>{item.options.find(([value]) => value === answers[item.key])?.[1] ?? (answers[item.key] === "insight-os" ? "InsightOS" : answers[item.key] === "professional" ? "Professional partnership" : "To discuss")}</dd></div>)}</dl>
        </details>
        <button className="irn-ej-text" type="button" disabled={pending} onClick={back}><ArrowLeft size={16} aria-hidden="true" /> {history.length ? "Back" : "Answer the optional questions"}</button>
        <EnquiryForm embedded variant={variant} answers={answers} onAccepted={onAccepted} onPendingChange={(next) => { setPending(next); onPendingChange?.(next); }} />
      </div>
      <p className="irn-ej-safety">For adults aged 18 and over, and families seeking help for an adult. IRN is not an emergency service. In immediate danger, call 999 or attend A&amp;E.</p>
    </div>
  );
}
