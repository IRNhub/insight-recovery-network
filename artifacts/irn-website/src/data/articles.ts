export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: number;
  category: string;
  content: string;
}

export const CATEGORIES = [
  "All",
  "Addiction & Substances",
  "Treatment Options",
  "Recovery & Wellbeing",
  "Mental Health",
  "Family & Relationships",
];

export const articles: Article[] = [
  {
    slug: "understanding-alcohol-dependency",
    title: "Understanding Alcohol Dependency: Signs, Stages and What to Do Next",
    excerpt:
      "Alcohol dependency develops gradually, often beneath the surface of everyday life. Recognising the signs early can make a significant difference to the path ahead.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-04-28",
    readingTime: 7,
    category: "Addiction & Substances",
    content: `
Alcohol dependency is one of the most prevalent and least understood forms of addiction. Unlike illicit drug use, alcohol exists within the fabric of social life — making it uniquely difficult to recognise when consumption has crossed from habit into dependence.

## What Is Alcohol Dependency?

Alcohol dependency — also referred to as alcohol use disorder (AUD) — is a chronic condition characterised by an inability to control drinking despite negative consequences. It exists on a spectrum, ranging from mild to severe, and involves both physical and psychological components.

Physical dependence means the body has adapted to the presence of alcohol and will produce withdrawal symptoms in its absence. Psychological dependence reflects the emotional reliance on alcohol to manage stress, anxiety, or emotional pain.

## Recognising the Signs

Early recognition is critical. Common indicators include:

- Drinking more or for longer than intended
- Repeated unsuccessful attempts to cut back
- Significant time spent drinking or recovering from its effects
- Cravings or strong urges to drink
- Continued drinking despite relationship, occupational, or health problems
- Tolerance — needing more alcohol to achieve the same effect
- Withdrawal symptoms such as anxiety, tremors, sweating, or insomnia when not drinking

It is important to note that someone can be physically dependent on alcohol without appearing to behave in ways that others would recognise as problematic. High-functioning dependency is common, particularly among professionals.

## The Stages of Dependency

**Stage 1 – Occasional misuse:** Drinking is episodic and often linked to social or emotional triggers. At this stage, the person retains control but begins to use alcohol as a coping mechanism.

**Stage 2 – Increased tolerance:** Regular consumption leads to increased tolerance. Larger quantities are required to feel the same effect, and the individual may begin drinking earlier in the day or in isolation.

**Stage 3 – Problematic dependence:** Physical and psychological withdrawal symptoms begin to appear. Drinking becomes necessary to function. Relationships, work performance, and health begin to suffer.

**Stage 4 – Severe dependency:** At this stage, alcohol is central to all daily functioning. Without medical support, abrupt cessation can be dangerous, even fatal.

## What To Do Next

If you recognise these signs in yourself or someone close to you, the most important thing to understand is that dependency is a medical condition — not a moral failure.

The next steps depend on the severity of dependency. For those with physical dependence, medically supervised detoxification is essential before any further treatment. Attempting to stop abruptly without medical oversight carries genuine health risks.

Following detox, structured treatment — whether residential or outpatient — addresses the underlying patterns and provides the tools to build a sustainable recovery.

We are here to help you understand the most appropriate pathway forward. A private and confidential conversation can be the first step.
    `.trim(),
  },
  {
    slug: "what-happens-in-residential-rehabilitation",
    title: "What Happens in Residential Rehabilitation?",
    excerpt:
      "Residential rehabilitation is often the most effective route for complex or severe addiction. Here is an honest account of what the process actually involves.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-04-14",
    readingTime: 8,
    category: "Treatment Options",
    content: `
Residential rehabilitation — commonly referred to as 'rehab' — remains one of the most clinically effective environments for treating moderate to severe addiction. Yet it is also one of the most misunderstood, often shaped in public perception by dramatic portrayals rather than clinical reality.

This article offers a clear, honest account of what the process involves.

## What Is Residential Rehabilitation?

Residential rehabilitation is a structured, immersive treatment programme in which an individual lives within a clinical or therapeutic setting — typically for 28 days, although programmes of 60 or 90 days are common for more complex presentations. During this time, the individual is removed from their usual environment and supported through a combination of medical, therapeutic, and psychoeducational interventions.

## The First Phase: Detoxification

For individuals with physical dependence — whether to alcohol, opioids, benzodiazepines or other substances — the first phase of residential treatment is medically supervised detoxification. This is not the same as rehabilitation itself, though they are often provided sequentially within the same facility.

Medically supervised detox involves the careful management of withdrawal symptoms using pharmaceutical protocols, monitoring of vital signs, and 24-hour clinical oversight. The duration of detox varies depending on the substance and severity of dependence but typically lasts between 5 and 10 days.

## The Therapeutic Phase

Once stabilised, the individual enters the substantive therapeutic component of the programme. This typically includes:

**Individual psychotherapy:** One-to-one sessions with a therapist or counsellor to explore the underlying drivers of addictive behaviour, address trauma, and develop personalised relapse prevention strategies.

**Group therapy:** Daily structured group sessions provide an opportunity to develop peer connection, challenge distorted thinking, and build communication skills in a safe environment.

**Psychoeducation:** Educational sessions covering topics such as the neuroscience of addiction, triggers and craving management, family dynamics, and the process of recovery.

**Complementary therapies:** Many high-quality facilities offer trauma-focused adjuncts such as EMDR, yoga, mindfulness, equine therapy, or art therapy. These are not frivolous additions — for many people, trauma is at the root of their addiction.

**Family involvement:** Where appropriate, family members are invited into the treatment process through sessions designed to repair relationships and equip those around the individual with the knowledge to provide appropriate support post-discharge.

## What Does a Typical Day Look Like?

Structure is itself therapeutic. Days in residential treatment are carefully designed to re-establish routine, which is often absent in the lives of those struggling with addiction. A typical day might begin with a morning check-in or mindfulness practice, move through several group and individual sessions, include peer mealtimes and supervised recreation, and end with an evening reflection group.

The absence of phones and external stressors — while potentially difficult at first — creates the contained environment that deep therapeutic work requires.

## After Residential Treatment

The transition from residential care to everyday life is a critical juncture. Quality facilities invest significant time in aftercare planning, which typically includes:

- Establishing an ongoing therapeutic relationship (counsellor, psychotherapist, or psychiatrist)
- Engagement with community-based support such as 12-step or SMART Recovery meetings
- A structured relapse prevention plan
- Regular check-ins or digital recovery tools to maintain accountability and structure

## Is Residential Rehabilitation Right for Everyone?

Not necessarily. Residential treatment is most appropriate for those with moderate to severe dependency, complex presentations, or those for whom previous outpatient attempts have been unsuccessful. Others may do well with structured online support, intensive outpatient treatment, or a combination of approaches.

The most important thing is matching the right level of care to the individual's specific needs. We help people and families navigate exactly this question.
    `.trim(),
  },
  {
    slug: "managing-relapse-part-of-recovery",
    title: "Managing Relapse: Why It Is Part of Recovery, Not the End of It",
    excerpt:
      "Relapse is one of the most misunderstood aspects of addiction. Understanding it clinically — rather than morally — changes everything about how we respond to it.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-03-31",
    readingTime: 6,
    category: "Recovery & Wellbeing",
    content: `
Relapse is perhaps the most emotionally charged word in the language of addiction. For the person in recovery, it can feel like complete failure. For family members, it can bring overwhelming despair. And yet, clinically speaking, relapse is a well-understood feature of a chronic condition — not a sign that recovery is impossible.

## Relapse as a Medical Reality

Addiction shares features with other chronic medical conditions such as hypertension, diabetes, and asthma. All of these conditions involve periods of symptom management, occasional deterioration, and the need for ongoing treatment adjustment. We do not consider someone a failure for requiring medication adjustments when their blood pressure rises again. The same framework must apply to addiction.

According to published research, relapse rates for substance use disorders range from 40 to 60 per cent — comparable to those of other chronic illnesses. This is not a statement about inevitable failure. It is a clinical acknowledgement that recovery is rarely a straight line.

## The Stages of Relapse

Relapse does not happen in an instant. It typically unfolds across three stages, often referred to as emotional, mental, and physical relapse.

**Emotional relapse** occurs when someone is not actively thinking about using, but their behaviours and emotional state are setting the conditions for future use. This might include neglecting self-care, isolating from support, suppressing difficult emotions, or not attending therapy or meetings.

**Mental relapse** is characterised by increasingly conscious thoughts about using. The person begins to glamorise past use, minimise the consequences, and bargain internally about whether 'controlled' use might be possible.

**Physical relapse** is the act of using. At this stage, early intervention is significantly more effective than waiting.

## Why Recognising the Stages Matters

One of the most valuable skills developed in recovery is the ability to identify early warning signs — in oneself and, for families, in a loved one. Catching relapse at the emotional or mental stage, before physical use occurs, allows for meaningful intervention.

This is one reason structured aftercare and ongoing therapeutic support is so important. Regular check-ins, journalling, and digital recovery tools can help identify drifting patterns before they reach crisis point.

## Responding to Physical Relapse

If physical relapse has occurred, the most important response is one of calm, practical action rather than moral condemnation. The conversation should focus on safety first, then understanding what happened, and then adjusting the recovery plan accordingly.

For some people, a short return to residential or intensive outpatient treatment may be appropriate. For others, a review and strengthening of their existing support structure is sufficient. The key is responding quickly, rather than allowing shame to prevent engagement with support.

## The Role of Shame

Shame is one of the most powerful drivers of continued use following a relapse. The internal narrative of 'I've blown it, so I might as well continue' is dangerously common. Treatment approaches that address shame directly — including certain trauma-focused therapies — are essential in breaking this cycle.

Families, too, can inadvertently amplify shame through reactions that, though understandable, communicate disappointment, anger, or withdrawal of support at the moment they are most needed.

## A Compassionate Framework

Understanding relapse as a clinical event rather than a moral failing does not mean minimising its consequences. It means responding to it in the way most likely to support a return to recovery. That requires compassion, structure, and appropriate clinical support.

We are here to help you navigate exactly this — whether you are the person who has relapsed, or someone supporting them through it.
    `.trim(),
  },
  {
    slug: "supporting-a-loved-one-through-recovery",
    title: "Supporting a Loved One Through Recovery: What Helps and What Does Not",
    excerpt:
      "Watching someone you care about struggle with addiction is one of the most distressing experiences a family can face. Knowing how to respond — and what to avoid — can make a real difference.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-03-17",
    readingTime: 7,
    category: "Family & Relationships",
    content: `
When someone you love is struggling with addiction, your instinct is to help. Yet the ways in which family members respond — however well-intentioned — can sometimes make the situation harder. This article offers a practical and compassionate guide to what actually helps, and what tends to create additional difficulty.

## Understanding Your Own Position First

Before addressing how to support someone else, it is worth acknowledging the position you are in. Loving someone with an addiction is exhausting. It involves sustained emotional strain, uncertainty, and often significant disruption to your own life. Recognising this — and seeking support for yourself — is not secondary to helping your loved one. It is essential to it.

Family members who are burned out, overwhelmed, or themselves psychologically depleted are less able to provide the calm, consistent support that recovery requires. Many people find that working with a therapist or counsellor — independently of their loved one — makes a meaningful difference.

## What Helps

**Educating yourself:** Addiction is a complex condition with a neurobiological basis. Understanding how it works — including concepts such as tolerance, withdrawal, craving, and relapse — significantly shifts how you interpret behaviour. Many things that feel like choices or deliberate acts of cruelty are better understood as symptoms of a condition.

**Maintaining boundaries:** Boundaries are not punishments. They are clear statements of what you are able to do and not do, and they protect both you and your loved one. A boundary might be: "I will not give you money if I believe it will be used to purchase alcohol." Communicating this clearly and calmly — and maintaining it consistently — is more helpful than inconsistent responses.

**Expressing concern without ultimatums:** Telling someone how you feel — "I am frightened for you and I love you" — is more likely to open dialogue than confrontational ultimatums. Framing concern in terms of your own experience, rather than accusations, tends to be better received.

**Encouraging professional support:** Rather than attempting to manage everything yourself, gently and persistently encourage your loved one to engage with appropriate clinical or therapeutic support. Offer to help practically — researching options, making phone calls, accompanying them to an initial appointment.

**Celebrating progress:** Recovery involves incremental gains. Acknowledging effort and progress — even when imperfect — builds the self-efficacy that sustains long-term change.

## What Does Not Help

**Enabling behaviour:** Enabling refers to actions that protect someone from the consequences of their addiction — paying off debts incurred through substance use, providing money without conditions, covering for their behaviour at work or with other family members. While these actions feel caring in the moment, they often remove the natural pressure that can motivate change.

**Controlling or monitoring:** Attempting to police someone's behaviour — checking their phone, searching their belongings, issuing constant warnings — is rarely effective and damages trust. It also places an enormous burden on you.

**Threatening consequences you will not follow through on:** Ultimatums that are not maintained undermine your credibility and reduce the likelihood of future ultimatums being taken seriously. Only state what you are genuinely prepared to act on.

**Taking responsibility for their recovery:** You can support someone's recovery, but you cannot do it for them. Taking on full responsibility for their wellbeing — and experiencing their relapses as your personal failures — is unsustainable and counterproductive.

**Engaging during intoxication:** Important conversations, confrontations, and expressions of concern should take place when your loved one is sober. Attempting to resolve conflict during intoxication rarely achieves anything and can escalate the situation.

## When to Seek Guidance

If you are unsure what to do, or if the situation is deteriorating, seeking professional guidance is appropriate. Family intervention specialists, addiction counsellors, and organisations such as Al-Anon can all provide structured support.

We work with families throughout this process — from the initial conversation about what is happening, through to supporting someone into treatment and helping families adjust to life in recovery.
    `.trim(),
  },
  {
    slug: "mental-health-and-addiction",
    title: "The Connection Between Mental Health and Addiction",
    excerpt:
      "Addiction and mental health conditions frequently co-occur. Understanding the relationship between them is essential to effective treatment.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-02-24",
    readingTime: 6,
    category: "Mental Health",
    content: `
Addiction and mental health conditions do not exist in separate compartments. The relationship between them is complex, bidirectional, and clinically significant — and understanding it is central to designing effective treatment.

## The Prevalence of Co-occurring Conditions

Research consistently demonstrates that a significant proportion of people with substance use disorders also have one or more mental health conditions. This is referred to as a 'dual diagnosis' or 'co-occurring disorder.' Common conditions that co-occur with addiction include:

- Depression and persistent low mood
- Anxiety disorders, including generalised anxiety, panic disorder, and social anxiety
- Post-traumatic stress disorder (PTSD)
- Bipolar disorder
- Attention deficit hyperactivity disorder (ADHD)
- Borderline personality disorder

This is not coincidental. There are well-established biological, psychological, and social pathways through which these conditions intersect.

## The Direction of the Relationship

The relationship between mental health and addiction can run in multiple directions, and it is not always easy to establish which came first.

**Mental health conditions as drivers of substance use:** Many people begin using substances as a way of managing the symptoms of an undiagnosed or untreated mental health condition. Alcohol might be used to reduce social anxiety. Stimulants might be used to manage the cognitive challenges of ADHD. Opioids might be used to blunt the emotional pain of trauma. This is referred to as 'self-medication.'

Over time, the substance that initially appeared to provide relief begins to worsen the underlying condition, creates its own set of problems, and becomes a disorder in its own right.

**Substance use as a cause of mental health conditions:** Sustained substance use alters brain chemistry in ways that can produce or exacerbate mental health symptoms. Heavy alcohol use is strongly associated with depression. Cannabis use, particularly heavy use in adolescence, is associated with increased risk of psychosis. Stimulant use can precipitate anxiety, paranoia, and in some cases psychosis.

**Shared underlying factors:** Genetics, early life adversity, trauma, and neurobiological vulnerabilities can predispose an individual to both addiction and mental health conditions simultaneously, without one directly causing the other.

## Why This Matters for Treatment

A treatment approach that addresses only the substance use, without attending to co-occurring mental health conditions, is unlikely to be fully effective. If someone is using alcohol to manage untreated panic attacks, removing the alcohol without addressing the panic attacks leaves the person without a coping mechanism and at high risk of relapse.

Similarly, treatment that focuses exclusively on the mental health presentation without addressing the substance use is unlikely to succeed — active addiction profoundly affects neurological functioning, mood regulation, and therapeutic capacity.

This is why integrated treatment — approaches that address both presentations simultaneously — represents the current clinical standard. It is also why thorough clinical assessment at the outset of treatment is essential: the picture needs to be understood comprehensively before an appropriate pathway can be identified.

## Trauma as a Central Factor

For many people, trauma sits at the intersection of mental health and addiction. Early adverse experiences — including neglect, abuse, loss, and exposure to violence — significantly increase the risk of both PTSD and substance use disorder. Trauma-informed approaches to treatment acknowledge this and incorporate interventions specifically designed to address traumatic experiences safely.

EMDR (Eye Movement Desensitisation and Reprocessing), trauma-focused cognitive behavioural therapy (TF-CBT), and somatic approaches are among the evidence-based interventions increasingly integrated into addiction treatment for individuals with trauma histories.

## Seeking an Integrated Assessment

If you are seeking support for yourself or a loved one, we would strongly encourage pursuing an assessment that considers both substance use and mental health comprehensively. The pathway that follows needs to be based on an accurate picture of the whole person — not just one dimension of their presentation.

We can help you navigate this, and identify the most appropriate treatment environment for your specific situation.
    `.trim(),
  },
  {
    slug: "online-recovery-programmes",
    title: "Online Recovery Programmes: Who Are They For and Do They Work?",
    excerpt:
      "Digital recovery support has matured significantly in recent years. For many people, structured online programmes offer a clinically effective alternative to in-person treatment.",
    author: "Craig Bilton",
    authorRole: "Founder & Clinical Director",
    date: "2026-02-10",
    readingTime: 5,
    category: "Treatment Options",
    content: `
Online recovery programmes have evolved considerably. What was once a fringe option — often dismissed as a poor substitute for 'real' treatment — is now a well-evidenced, clinically structured pathway that suits a substantial proportion of people seeking support for addiction and mental health challenges.

## What Has Changed

The shift has been driven by several converging factors. The acceleration of digital health during the pandemic demonstrated that therapeutic relationships can be effectively maintained at a distance. Research into telehealth outcomes has consistently shown that for many presentations, outcomes are comparable to in-person delivery.

Simultaneously, the quality and structure of online recovery programmes has improved. The best programmes are not simply virtual replicas of in-person treatment — they are thoughtfully designed to leverage the specific advantages of digital delivery while compensating for its limitations.

## Who Are Online Programmes Suited To?

Online recovery support is most appropriate for individuals who:

**Do not have significant physical dependence:** Online programmes are not designed to manage acute withdrawal. Anyone with physical dependence on alcohol, benzodiazepines, or opioids will require medically supervised detoxification before engaging with a structured programme.

**Have a degree of stability in their environment:** Effective engagement with online therapeutic content requires a reasonably stable physical environment — somewhere private, consistent, and free from immediate crisis.

**Have professional or family commitments that make residential treatment impractical:** One of the most significant advantages of online delivery is that it does not require an individual to step out of their life. Parents, working professionals, and individuals with caring responsibilities often find residential treatment logistically impossible. Structured online support allows treatment to be integrated into daily life.

**Are earlier in their dependency trajectory:** For those in the early stages of problematic use, or those who have completed residential treatment and need structured ongoing support, online programmes provide an accessible and proportionate level of care.

**Are geographically remote:** For individuals in areas with limited access to specialist treatment services, online delivery significantly expands what is available.

## What Good Online Recovery Support Looks Like

Quality online programmes share several characteristics:

**Clinical oversight:** There should be qualified clinicians — addiction specialists, psychologists, or psychiatrists — involved in programme design and, where appropriate, individual care.

**Structured therapeutic content:** Effective programmes draw on evidence-based therapeutic modalities, including cognitive behavioural therapy (CBT), motivational enhancement, and relapse prevention frameworks — not simply peer sharing or unstructured discussion.

**Group connection:** Peer support remains one of the most powerful components of recovery. Well-designed online programmes incorporate facilitated group sessions that create genuine connection and mutual accountability.

**Individual support:** Access to one-to-one support — whether through scheduled sessions or responsive check-ins — is important for addressing the specific needs and challenges that arise for each individual.

**Digital recovery tools:** Features such as journalling, mood tracking, trigger mapping, and structured goal-setting help individuals maintain insight and engagement between sessions.

## Our Online Programme and Insight OS

Insight Recovery Network offers a structured online recovery programme that incorporates facilitated group sessions, individual support, and psychoeducational content — alongside Insight OS, our dedicated digital recovery platform for daily check-ins, journalling, and recovery planning.

If you would like to understand whether an online programme is appropriate for your situation, we would be glad to speak with you confidentially.
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
